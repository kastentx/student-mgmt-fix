/**
 * Unit tests for Student Service layer
 * Tests business logic without requiring database or HTTP connections
 */

const studentsService = require("./students-service");
const studentsRepository = require("./students-repository");
const sharedRepository = require("../../shared/repository");

// Mock the repository layers
jest.mock("./students-repository");
jest.mock("../../shared/repository");

describe("Students Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllStudents", () => {
        it("should return students with pagination data", async () => {
            const mockStudents = [
                { id: 1, name: "John Doe", email: "john@test.com" },
                { id: 2, name: "Jane Smith", email: "jane@test.com" }
            ];
            const mockPagination = {
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1
            };

            studentsRepository.findAllStudents.mockResolvedValue({
                students: mockStudents,
                pagination: mockPagination
            });

            const result = await studentsService.getAllStudents({});

            expect(studentsRepository.findAllStudents).toHaveBeenCalledWith({});
            expect(result).toHaveProperty("students");
            expect(result).toHaveProperty("pagination");
            expect(result.students).toHaveLength(2);
            expect(result.pagination.total).toBe(2);
        });

        it("should pass filter parameters to repository", async () => {
            const mockResult = {
                students: [],
                pagination: { page: 2, limit: 5, total: 0, totalPages: 0 }
            };
            studentsRepository.findAllStudents.mockResolvedValue(mockResult);

            const filters = { page: 2, limit: 5, search: "John" };
            await studentsService.getAllStudents(filters);

            expect(studentsRepository.findAllStudents).toHaveBeenCalledWith(filters);
        });
    });

    describe("getStudentDetail", () => {
        it("should return student details for valid id", async () => {
            const mockStudent = {
                id: 1,
                name: "John Doe",
                email: "john@test.com",
                class: "Grade 10",
                section: "A"
            };
            sharedRepository.findUserById.mockResolvedValue({ id: 1 });
            studentsRepository.findStudentDetail.mockResolvedValue(mockStudent);

            const result = await studentsService.getStudentDetail(1);

            expect(sharedRepository.findUserById).toHaveBeenCalledWith(1);
            expect(studentsRepository.findStudentDetail).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockStudent);
        });

        it("should throw error for non-existent student", async () => {
            sharedRepository.findUserById.mockResolvedValue(null);

            await expect(studentsService.getStudentDetail(99999))
                .rejects
                .toThrow("Student not found");
        });
    });

    describe("deleteStudent", () => {
        it("should delete existing student", async () => {
            sharedRepository.findUserById.mockResolvedValue({ id: 1 });
            studentsRepository.deleteStudent.mockResolvedValue(1);

            await expect(studentsService.deleteStudent(1)).resolves.not.toThrow();
            expect(studentsRepository.deleteStudent).toHaveBeenCalledWith(1);
        });

        it("should throw error when deleting non-existent student", async () => {
            sharedRepository.findUserById.mockResolvedValue(null);

            await expect(studentsService.deleteStudent(99999))
                .rejects
                .toThrow("Student not found");
        });
    });

    describe("changeStudentStatus", () => {
        it("should update student status", async () => {
            sharedRepository.findUserById.mockResolvedValue({ id: 1 });
            studentsRepository.findStudentToSetStatus.mockResolvedValue(1);

            const result = await studentsService.setStudentStatus({ 
                userId: 1, 
                reviewerId: 1, 
                status: false 
            });

            expect(studentsRepository.findStudentToSetStatus).toHaveBeenCalledWith({ 
                userId: 1, 
                reviewerId: 1, 
                status: false 
            });
            expect(result.message).toBe("Student status changed successfully");
        });
    });
});
