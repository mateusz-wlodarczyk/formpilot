import {
  createFormLogic,
  getFormsLogic,
  updateFormLogic,
} from "../../src/lib/forms-logic";

// Mock Prisma
jest.mock("../../src/lib/prisma/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    form: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock NextAuth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock auth options
jest.mock("../../src/lib/auth/auth", () => ({
  authOptions: {},
}));

// Mock test data
jest.mock("../../src/lib/test-data", () => ({
  TEST_USER_ID: "test-user-id",
}));

const mockPrisma = require("../../src/lib/prisma/prisma").prisma;
const mockGetServerSession = require("next-auth").getServerSession;

describe("Forms API logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createFormLogic", () => {
    it("creates a form successfully", async () => {
      const mockForm = {
        id: "form-id",
        title: "Test Form",
        description: "Test Description",
        fields: [],
        userId: "user-id",
      };
      mockPrisma.form.create.mockResolvedValue(mockForm);
      const data = {
        title: "Test Form",
        description: "Test Description",
        fields: [],
      };
      const result = await createFormLogic({ userId: "user-id", data });
      expect(result).toEqual(mockForm);
      expect(mockPrisma.form.create).toHaveBeenCalledWith({
        data: {
          title: "Test Form",
          description: "Test Description",
          fields: [],
          userId: "user-id",
        },
      });
    });
  });

  describe("getFormsLogic", () => {
    it("fetches forms successfully", async () => {
      const mockForms = [
        {
          id: "form-1",
          title: "Form 1",
          description: "Description 1",
          createdAt: new Date(),
          _count: { submissions: 5 },
        },
      ];
      mockPrisma.form.findMany.mockResolvedValue(mockForms);
      const result = await getFormsLogic({
        userId: "user-id",
        page: 0,
        pageSize: 20,
      });
      expect(result).toEqual(mockForms);
      expect(mockPrisma.form.findMany).toHaveBeenCalledWith({
        where: { userId: "user-id" },
        select: {
          id: true,
          title: true,
          description: true,
          isActive: true,
          createdAt: true,
          _count: { select: { submissions: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 20,
      });
    });
  });

  describe("updateFormLogic", () => {
    it("updates a form successfully", async () => {
      const mockForm = {
        id: "form-id",
        title: "Updated Form",
        description: "Updated Description",
        fields: [],
        userId: "user-id",
      };
      mockPrisma.form.findFirst.mockResolvedValue(mockForm);
      mockPrisma.form.update.mockResolvedValue(mockForm);
      const result = await updateFormLogic({
        userId: "user-id",
        id: "form-id",
        updates: { title: "Updated Form", description: "Updated Description" },
      });
      expect(result).toEqual(mockForm);
      expect(mockPrisma.form.update).toHaveBeenCalledWith({
        where: { id: "form-id" },
        data: { title: "Updated Form", description: "Updated Description" },
      });
    });
    it("returns null if form not found", async () => {
      mockPrisma.form.findFirst.mockResolvedValue(null);
      const result = await updateFormLogic({
        userId: "user-id",
        id: "not-exist",
        updates: { title: "X" },
      });
      expect(result).toBeNull();
    });
  });
});
