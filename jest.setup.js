import "@testing-library/jest-dom";

// Polyfill for fetch
global.fetch = jest.fn();

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "";
  },
  useParams() {
    return { formId: "test-form-id" };
  },
}));

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Mock window.URL.createObjectURL
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: jest.fn(() => "mocked-url"),
  },
  writable: true,
});

// Mock document.createElement
const originalCreateElement = document.createElement;
document.createElement = jest.fn((tagName) => {
  if (tagName === "a") {
    return {
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: {},
    };
  }
  return originalCreateElement.call(document, tagName);
});

// Mock ResizeObserver for Recharts
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock URL constructor for NextAuth
global.URL = jest.fn().mockImplementation((url) => ({
  href: url,
  origin: "http://localhost:3000",
  pathname: "/",
  search: "",
  hash: "",
  searchParams: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
  },
}));

// Mock clipboard API
// Object.defineProperty(navigator, "clipboard", {
//   value: {
//     writeText: jest.fn(),
//     readText: jest.fn(),
//   },
//   writable: true,
// });
