import { fields, singleton } from "@keystatic/core";

/**
 * Page copy edited in /keystatic: service categories, specialties, home, about and
 * site settings. Each singleton edits one content/*.json file that the page reads at
 * build time. Every JSON key must be in a schema here, or Keystatic drops it on save.
 * Docs: WebSiteDoc/Project/16e-cms-editable-pages.md
 */
const line = (label: string, description?: string) =>
  fields.text({ label, description, validation: { isRequired: true } });
const para = (label: string) =>
  fields.text({ label, multiline: true, validation: { isRequired: true } });
const paras = (label: string) =>
  fields.array(para("Paragraph"), { label, itemLabel: (p) => p.value.slice(0, 50) });

const faqs = (label = "FAQs (also become FAQPage schema)") =>
  fields.array(
    fields.object({ question: line("Question"), answer: para("Answer") }),
    { label, itemLabel: (p) => p.fields.question.value },
  );

const titleBody = (label: string) =>
  fields.array(fields.object({ title: line("Title"), body: para("Text") }), {
    label,
    itemLabel: (p) => p.fields.title.value,
  });

const category = (label: string) =>
  fields.object(
    {
      title: line("Page heading (H1)"),
      lead: para("Intro paragraph under the heading"),
      features: fields.array(
        fields.object({
          heading: line("Heading"),
          body: paras("Text"),
          image: line("Image path", "Keep as is unless a new image was added to web/public."),
          alt: line("Image description (alt text)"),
        }),
        { label: "Image and text rows", itemLabel: (p) => p.fields.heading.value },
      ),
      faqs: faqs(),
    },
    { label },
  );

const specialty = (label: string) =>
  fields.object(
    {
      heroHeadline: line("Page heading (H1)"),
      heroLead: para("Intro paragraph under the heading"),
      whyHeadline: line("Section heading: why CCM pays"),
      whyParagraphs: paras("Section paragraphs"),
      patientMix: fields.array(line("Condition"), {
        label: "Conditions you will already be seeing",
        itemLabel: (p) => p.value,
      }),
      faqs: faqs(),
    },
    { label },
  );

const optional = (label: string, description?: string) => fields.text({ label, description });
const url = (label: string, description?: string) =>
  fields.text({
    label,
    description,
    validation: { pattern: { regex: /^(https:\/\/\S+)?$/, message: "Start with https:// or leave empty" } },
  });

export const collections = {};

export const singletons = {
  // content/categories.json: the three service category pages.
  categories: singleton({
    label: "Service category pages",
    path: "content/categories",
    format: "json",
    schema: {
      rpm: category("Care management (/services/care-management)"),
      rcm: category("Revenue cycle management (/services/revenue-cycle-management)"),
      staffing: category("Virtual staffing (/services/virtual-staffing)"),
    },
  }),
  // content/specialties.json: /who-we-serve/<specialty> pages.
  specialties: singleton({
    label: "Who we serve pages",
    path: "content/specialties",
    format: "json",
    schema: {
      "primary-care": specialty("Primary care"),
      "internal-medicine": specialty("Internal medicine"),
      geriatrics: specialty("Geriatrics"),
    },
  }),
  // content/home.json: plain-text parts of the home page.
  home: singleton({
    label: "Home page text",
    path: "content/home",
    format: "json",
    schema: {
      heroLead: para("Hero paragraph under the headline"),
      servicesHeading: line("Service lines heading"),
      servicesLead: para("Service lines paragraph"),
      whoHeading: line("Who we serve heading"),
      whoLead: para("Who we serve paragraph"),
      whoPains: fields.object(
        {
          primaryCare: para("Primary care card text"),
          internalMedicine: para("Internal medicine card text"),
          geriatrics: para("Geriatrics card text"),
        },
        { label: "Who we serve cards" },
      ),
      stepsHeading: line("How it works heading"),
      steps: titleBody("How it works steps"),
      whyHeading: line("Why Zenith heading"),
      why: titleBody("Why Zenith points"),
      aboutHeading: line("About strip heading"),
      aboutBody: para("About strip paragraph"),
      faqHeading: line("FAQ heading"),
      faqs: faqs("Home page FAQs (also become FAQPage schema)"),
      ctaHeading: line("Closing call to action heading"),
      ctaBody: para("Closing call to action paragraph"),
    },
  }),
  // content/about.json: /about.
  about: singleton({
    label: "About page text",
    path: "content/about",
    format: "json",
    schema: {
      heroLead: para("Hero paragraph"),
      whoHeading: line("Who we are heading"),
      whoBody: para("Who we are paragraph"),
      mission: para("Mission"),
      vision: para("Vision"),
      promise: para("Promise"),
      beliefHeading: line("Story heading"),
      beliefParagraphs: paras("Story paragraphs"),
      quote: para("Pull quote (quote marks are added)"),
      messageHeading: line("Message from Zenith heading"),
      messageParagraphs: paras("Message from Zenith paragraphs"),
      challengeHeading: line("Challenge heading"),
      challengeParagraphs: paras("Challenge paragraphs"),
      pillarsHeading: line("Pillars heading"),
      pillars: fields.array(
        fields.object({ name: line("Label"), line: line("Headline"), detail: para("Detail") }),
        { label: "Pillars", itemLabel: (p) => p.fields.name.value },
      ),
      servicesHeading: line("What we do heading"),
      stepsHeading: line("How we work heading"),
      stepsLead: para("How we work paragraph"),
      steps: titleBody("How we work steps"),
      whyHeading: line("Why practices work with Zenith heading"),
      why: titleBody("Why practices work with Zenith points"),
      trustHeading: line("Trust and safeguards heading"),
      trustBody: para("Trust and safeguards paragraph"),
      trustBullets: fields.array(para("Bullet"), { label: "Trust bullets", itemLabel: (p) => p.value.slice(0, 50) }),
      ctaHeading: line("Closing call to action heading"),
      ctaBody: para("Closing call to action paragraph"),
    },
  }),
  // content/site.json: contact details, social links, footer text, founder intros (lib/site.ts).
  site: singleton({
    label: "Site settings",
    path: "content/site",
    format: "json",
    schema: {
      email: line(
        "Contact email",
        "Shown on the site and used for mailto links. Ignored while NEXT_PUBLIC_CONTACT_EMAIL is set in Vercel: the environment variable wins.",
      ),
      phone: optional("Phone", "Leave empty to hide. Ignored while NEXT_PUBLIC_CONTACT_PHONE is set in Vercel."),
      whatsappNumber: optional(
        "WhatsApp number",
        "Digits with country code, no plus sign. Leave empty to hide. Ignored while NEXT_PUBLIC_WHATSAPP_NUMBER is set in Vercel.",
      ),
      calendlyUrl: url("Booking link (Calendly)", "Ignored while NEXT_PUBLIC_CALENDLY_URL is set in Vercel."),
      hours: optional("Business hours", "Leave empty to hide. Ignored while NEXT_PUBLIC_BUSINESS_HOURS is set in Vercel."),
      mailingAddress: line("Mailing address", "A mail-forwarding address, never called an office."),
      tagline: para("Site tagline"),
      linkedin: url("LinkedIn URL"),
      facebook: url("Facebook URL", "Ignored while NEXT_PUBLIC_FACEBOOK_URL is set in Vercel."),
      instagram: url("Instagram URL", "Ignored while NEXT_PUBLIC_INSTAGRAM_URL is set in Vercel."),
      footerBlurb: para("Footer blurb under the logo"),
      footerDisclaimer: para("Footer disclaimer"),
      founders: fields.array(
        fields.object({
          name: line("Name", "Must match the founder's name exactly. Do not change it."),
          intro: para("One-line intro (home page and article bylines)"),
        }),
        { label: "Founder intros", itemLabel: (p) => p.fields.name.value },
      ),
    },
  }),
};
