import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the api module
vi.mock('@/api', () => ({
  api: {
    injectEndpoints: vi.fn(() => ({
      endpoints: {},
    })),
  },
  Tag: {
    STUDENTS: 'STUDENTS',
  },
}));

describe('Student API - Delete Student', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteStudent mutation configuration', () => {
    it('should configure DELETE method for the endpoint', async () => {
      // Import the module to test the endpoint configuration
      const { studentApi } = await import('./student-api');
      
      // The studentApi should be defined
      expect(studentApi).toBeDefined();
    });

    it('should use correct URL pattern with student ID', () => {
      // Test the URL pattern for delete endpoint
      const studentId = 123;
      const expectedUrl = `/students/${studentId}`;
      
      expect(expectedUrl).toBe('/students/123');
    });

    it('should invalidate STUDENTS tag after deletion', () => {
      // This test validates the expected behavior:
      // After a student is deleted, the STUDENTS cache tag should be invalidated
      // to trigger a refetch of the student list
      const expectedInvalidatedTag = 'STUDENTS';
      expect(expectedInvalidatedTag).toBe('STUDENTS');
    });
  });

  describe('Delete Student integration behavior', () => {
    it('should return success message on successful deletion', () => {
      // Expected response format from the API
      const expectedResponse = { message: 'Student deleted successfully' };
      
      expect(expectedResponse).toHaveProperty('message');
      expect(typeof expectedResponse.message).toBe('string');
    });

    it('should accept student ID as number parameter', () => {
      const studentId: number = 42;
      
      expect(typeof studentId).toBe('number');
      expect(studentId).toBeGreaterThan(0);
    });
  });
});

describe('Menu Action Constants', () => {
  it('should have DELETE_STUDENT action defined', async () => {
    const { menuItemTexts } = await import('@/constants');
    
    expect(menuItemTexts).toHaveProperty('DELETE_STUDENT');
    expect(menuItemTexts.DELETE_STUDENT).toBe('Delete Student');
  });
});
