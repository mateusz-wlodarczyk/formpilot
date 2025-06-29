import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const TEST_USER_ID = "test_user_123";
export const TEST_USER_EMAIL = "test@formpilot.com";
export const TEST_USER_NAME = "Test User";

const formTitles = [
  "Customer Feedback Survey",
  "Event Registration",
  "Product Review",
  "Service Satisfaction",
  "Newsletter Signup",
  "Contact Form",
  "Job Application",
  "Support Request",
  "Order Form",
  "Feedback Collection",
  "User Experience Survey",
  "Market Research",
  "Employee Satisfaction",
  "Client Onboarding",
  "Product Launch Feedback",
  "Website Feedback",
  "App Store Review",
  "Beta Testing Signup",
  "Conference Registration",
  "Workshop Feedback",
  "Training Evaluation",
  "Performance Review",
  "Exit Interview",
  "New Hire Survey",
  "Team Building Feedback",
  "Project Evaluation",
  "Meeting Feedback",
  "Course Evaluation",
  "Seminar Registration",
  "Webinar Signup",
  "Podcast Feedback",
  "Blog Comment",
  "Social Media Survey",
  "Brand Awareness",
  "Competitor Analysis",
  "Pricing Survey",
  "Feature Request",
  "Bug Report",
  "Improvement Suggestion",
  "General Inquiry",
  "Partnership Request",
  "Investment Interest",
  "Media Inquiry",
  "Press Release Signup",
  "Award Nomination",
  "Testimonial Submission",
  "Case Study Request",
  "White Paper Download",
  "Demo Request",
  "Trial Signup",
  "Subscription Form",
  "Payment Information",
  "Billing Inquiry",
  "Refund Request",
  "Shipping Information",
  "Delivery Feedback",
  "Return Request",
  "Warranty Claim",
  "Technical Support",
];

const fieldTypes = [
  "text",
  "email",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "number",
  "date",
];

const fieldLabels = [
  "Name",
  "Email",
  "Phone",
  "Company",
  "Position",
  "Department",
  "Age",
  "Gender",
  "Location",
  "Experience",
  "Skills",
  "Education",
  "Salary",
  "Availability",
  "Preferences",
  "Interests",
  "Goals",
  "Challenges",
  "Feedback",
  "Rating",
  "Satisfaction",
  "Recommendation",
  "Comments",
  "Suggestions",
  "Questions",
];

// Map field labels to appropriate types
const fieldLabelToType: Record<string, string> = {
  Name: "text",
  Email: "email",
  Phone: "text",
  Company: "text",
  Position: "text",
  Department: "select",
  Age: "number",
  Gender: "radio",
  Location: "text",
  Experience: "textarea",
  Skills: "textarea",
  Education: "textarea",
  Salary: "number",
  Availability: "select",
  Preferences: "checkbox",
  Interests: "checkbox",
  Goals: "textarea",
  Challenges: "textarea",
  Feedback: "textarea",
  Rating: "select",
  Satisfaction: "select",
  Recommendation: "radio",
  Comments: "textarea",
  Suggestions: "textarea",
  Questions: "textarea",
};

const selectOptions = [
  ["Excellent", "Good", "Average", "Poor", "Very Poor"],
  ["Yes", "No", "Maybe"],
  ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
  [
    "Very Satisfied",
    "Satisfied",
    "Neutral",
    "Dissatisfied",
    "Very Dissatisfied",
  ],
  ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"],
];

// Map field labels to specific options
const fieldLabelToOptions: Record<string, string[]> = {
  Department: [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Support",
  ],
  Availability: ["Full-time", "Part-time", "Contract", "Freelance", "Remote"],
  Rating: [
    "1 - Poor",
    "2 - Fair",
    "3 - Good",
    "4 - Very Good",
    "5 - Excellent",
  ],
  Satisfaction: [
    "Very Dissatisfied",
    "Dissatisfied",
    "Neutral",
    "Satisfied",
    "Very Satisfied",
  ],
  Gender: ["Male", "Female", "Non-binary", "Prefer not to say"],
  Recommendation: [
    "Strongly Recommend",
    "Recommend",
    "Neutral",
    "Wouldn't Recommend",
    "Strongly Against",
  ],
};

function generateRandomFields() {
  const numFields = Math.floor(Math.random() * 5) + 2; // 2-6 fields
  const fields = [];

  for (let i = 0; i < numFields; i++) {
    const label = fieldLabels[Math.floor(Math.random() * fieldLabels.length)];
    const type =
      fieldLabelToType[label] ||
      fieldTypes[Math.floor(Math.random() * fieldTypes.length)];

    const field: any = {
      id: `field_${i}`,
      type,
      label,
      required: Math.random() > 0.5,
    };

    if (type === "select" || type === "radio") {
      field.options =
        fieldLabelToOptions[label] ||
        selectOptions[Math.floor(Math.random() * selectOptions.length)];
    }

    fields.push(field);
  }

  return fields;
}

function generateRandomSubmissionData(fields: any[]) {
  const data: any = {};

  fields.forEach((field) => {
    switch (field.type) {
      case "text":
      case "email":
        data[field.id] = `${field.label} ${Math.floor(Math.random() * 1000)}`;
        break;
      case "textarea":
        data[field.id] =
          `Response for ${field.label.toLowerCase()}. This provides additional context and details.`;
        break;
      case "select":
      case "radio":
        data[field.id] =
          field.options[Math.floor(Math.random() * field.options.length)];
        break;
      case "checkbox":
        data[field.id] = Math.random() > 0.5;
        break;
      case "number":
        data[field.id] = Math.floor(Math.random() * 100) + 1;
        break;
      case "date":
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        data[field.id] = date.toISOString().split("T")[0];
        break;
    }
  });

  return data;
}

export async function createTestUser() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: TEST_USER_ID },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: TEST_USER_ID,
          email: TEST_USER_EMAIL,
          name: TEST_USER_NAME,
        },
      });
    }
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

export async function generateTestData() {
  try {
    // Check if test data already exists
    const existingForms = await prisma.form.findMany({
      where: { userId: TEST_USER_ID },
      take: 1,
    });

    if (existingForms.length > 0) {
      console.log("Test data already exists, skipping generation");
      return;
    }

    // Create test user if not exists
    await createTestUser();

    // Generate 59 forms with submissions
    for (let i = 0; i < 59; i++) {
      const title = formTitles[i % formTitles.length];
      const fields = generateRandomFields();

      const form = await prisma.form.create({
        data: {
          userId: TEST_USER_ID,
          title: `${title} ${i + 1}`,
          description: `This is a sample form for ${title.toLowerCase()} with ${fields.length} fields.`,
          fields,
          isActive: Math.random() > 0.3, // 70% chance of being active
        },
      });

      // Generate 5-20 submissions per form
      const numSubmissions = Math.floor(Math.random() * 16) + 5;

      for (let j = 0; j < numSubmissions; j++) {
        const submissionData = generateRandomSubmissionData(fields);

        await prisma.submission.create({
          data: {
            formId: form.id,
            data: submissionData,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error generating test data:", error);
  }
}

export async function clearTestData() {
  try {
    // Delete all submissions from test user's forms
    const testForms = await prisma.form.findMany({
      where: { userId: TEST_USER_ID },
      select: { id: true },
    });

    const formIds = testForms.map((form) => form.id);

    await prisma.submission.deleteMany({
      where: { formId: { in: formIds } },
    });

    // Delete all test forms
    await prisma.form.deleteMany({
      where: { userId: TEST_USER_ID },
    });

    // Delete test user
    await prisma.user.delete({
      where: { id: TEST_USER_ID },
    });
  } catch (error) {
    console.error("Error clearing test data:", error);
  }
}
