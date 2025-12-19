import { describe, it, expect } from 'vitest';
import {
  StudentFilterSchema,
  BasicInfoSchema,
  AcademicInfoSchema,
  AddressInfoSchema,
  ParentsAndGuardianInfoSchema,
} from './student-schema';

describe('Student Schemas', () => {
  describe('StudentFilterSchema', () => {
    it('should accept valid filter with all fields', () => {
      const validFilter = {
        class: 'Grade 10',
        section: 'A',
        name: 'John',
        roll: '101',
      };
      const result = StudentFilterSchema.safeParse(validFilter);
      expect(result.success).toBe(true);
    });

    it('should accept empty filter', () => {
      const result = StudentFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should accept partial filter', () => {
      const result = StudentFilterSchema.safeParse({ name: 'John' });
      expect(result.success).toBe(true);
    });
  });

  describe('BasicInfoSchema', () => {
    it('should validate required fields', () => {
      const validBasicInfo = {
        name: 'John Doe',
        gender: 'Male',
        dob: '2005-01-15',
        phone: '+1234567890',
        email: 'john@example.com',
      };
      const result = BasicInfoSchema.safeParse(validBasicInfo);
      expect(result.success).toBe(true);
    });

    it('should reject missing name', () => {
      const invalidBasicInfo = {
        gender: 'Male',
        dob: '2005-01-15',
        phone: '+1234567890',
        email: 'john@example.com',
      };
      const result = BasicInfoSchema.safeParse(invalidBasicInfo);
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const invalidBasicInfo = {
        name: 'John Doe',
        gender: 'Male',
        dob: '2005-01-15',
        phone: '+1234567890',
        email: '',
      };
      const result = BasicInfoSchema.safeParse(invalidBasicInfo);
      expect(result.success).toBe(false);
    });
  });

  describe('AcademicInfoSchema', () => {
    it('should validate required fields', () => {
      const validAcademicInfo = {
        class: 'Grade 10',
        section: 'A',
        roll: '101',
        admissionDate: '2024-01-15',
      };
      const result = AcademicInfoSchema.safeParse(validAcademicInfo);
      expect(result.success).toBe(true);
    });

    it('should coerce number roll to string', () => {
      const academicInfoWithNumberRoll = {
        class: 'Grade 10',
        section: 'A',
        roll: 101, // Number instead of string
        admissionDate: '2024-01-15',
      };
      const result = AcademicInfoSchema.safeParse(academicInfoWithNumberRoll);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.roll).toBe('string');
        expect(result.data.roll).toBe('101');
      }
    });

    it('should reject missing class', () => {
      const invalidAcademicInfo = {
        section: 'A',
        roll: '101',
        admissionDate: '2024-01-15',
      };
      const result = AcademicInfoSchema.safeParse(invalidAcademicInfo);
      expect(result.success).toBe(false);
    });
  });

  describe('AddressInfoSchema', () => {
    it('should validate required address fields', () => {
      const validAddress = {
        currentAddress: '123 Main St',
        permanentAddress: '456 Oak Ave',
      };
      const result = AddressInfoSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it('should reject empty current address', () => {
      const invalidAddress = {
        currentAddress: '',
        permanentAddress: '456 Oak Ave',
      };
      const result = AddressInfoSchema.safeParse(invalidAddress);
      expect(result.success).toBe(false);
    });
  });

  describe('ParentsAndGuardianInfoSchema', () => {
    it('should validate required guardian fields', () => {
      const validInfo = {
        fatherName: 'Robert Doe',
        fatherPhone: '+1234567890',
        motherName: 'Jane Doe',
        motherPhone: '+1234567891',
        guardianName: 'Robert Doe',
        guardianPhone: '+1234567890',
        relationOfGuardian: 'Father',
      };
      const result = ParentsAndGuardianInfoSchema.safeParse(validInfo);
      expect(result.success).toBe(true);
    });

    it('should reject missing guardian name', () => {
      const invalidInfo = {
        fatherName: 'Robert Doe',
        guardianPhone: '+1234567890',
        relationOfGuardian: 'Father',
      };
      const result = ParentsAndGuardianInfoSchema.safeParse(invalidInfo);
      expect(result.success).toBe(false);
    });
  });
});
