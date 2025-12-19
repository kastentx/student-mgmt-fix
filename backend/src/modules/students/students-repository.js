const { processDBRequest } = require("../../utils");

const getRoleId = async (roleName) => {
    const query = "SELECT id FROM roles WHERE name ILIKE $1";
    const queryParams = [roleName];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0].id;
}

const findAllStudents = async (payload) => {
    const { name, className, section, roll, search, page = 1, limit = 10 } = payload;
    const offset = (page - 1) * limit;
    
    let baseWhere = `WHERE t1.role_id = 3`;
    let queryParams = [];
    
    if (search) {
        queryParams.push(`%${search}%`);
        baseWhere += ` AND (t1.name ILIKE $${queryParams.length} OR t1.email ILIKE $${queryParams.length})`;
    }
    if (name) {
        queryParams.push(name);
        baseWhere += ` AND t1.name = $${queryParams.length}`;
    }
    if (className) {
        queryParams.push(className);
        baseWhere += ` AND t3.class_name = $${queryParams.length}`;
    }
    if (section) {
        queryParams.push(section);
        baseWhere += ` AND t3.section_name = $${queryParams.length}`;
    }
    if (roll) {
        queryParams.push(roll);
        baseWhere += ` AND t3.roll = $${queryParams.length}`;
    }

    // Count query
    const countQuery = `
        SELECT COUNT(*) as total
        FROM users t1
        LEFT JOIN user_profiles t3 ON t1.id = t3.user_id
        ${baseWhere}`;
    const { rows: countRows } = await processDBRequest({ query: countQuery, queryParams: [...queryParams] });
    const total = parseInt(countRows[0].total, 10);

    // Data query with pagination
    const dataQuery = `
        SELECT
            t1.id,
            t1.name,
            t1.email,
            t1.last_login AS "lastLogin",
            t1.is_active AS "systemAccess"
        FROM users t1
        LEFT JOIN user_profiles t3 ON t1.id = t3.user_id
        ${baseWhere}
        ORDER BY t1.id
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    
    const { rows } = await processDBRequest({ 
        query: dataQuery, 
        queryParams: [...queryParams, limit, offset] 
    });
    
    return {
        students: rows,
        pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const addOrUpdateStudent = async (payload) => {
    const query = "SELECT * FROM student_add_update($1)";
    const queryParams = [payload];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0];
}

const findStudentDetail = async (id) => {
    const query = `
        SELECT
            u.id,
            u.name,
            u.email,
            u.is_active AS "systemAccess",
            p.phone,
            p.gender,
            p.dob,
            p.class_name AS "class",
            p.section_name AS "section",
            p.roll,
            p.father_name AS "fatherName",
            p.father_phone AS "fatherPhone",
            p.mother_name AS "motherName",
            p.mother_phone AS "motherPhone",
            p.guardian_name AS "guardianName",
            p.guardian_phone AS "guardianPhone",
            p.relation_of_guardian as "relationOfGuardian",
            p.current_address AS "currentAddress",
            p.permanent_address AS "permanentAddress",
            p.admission_dt AS "admissionDate",
            r.name as "reporterName"
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        LEFT JOIN users r ON u.reporter_id = r.id
        WHERE u.id = $1`;
    const queryParams = [id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows[0];
}

const findStudentToSetStatus = async ({ userId, reviewerId, status }) => {
    const now = new Date();
    const query = `
        UPDATE users
        SET
            is_active = $1,
            status_last_reviewed_dt = $2,
            status_last_reviewer_id = $3
        WHERE id = $4
    `;
    const queryParams = [status, now, reviewerId, userId];
    const { rowCount } = await processDBRequest({ query, queryParams });
    return rowCount
}

const findStudentToUpdate = async (paylaod) => {
    const { basicDetails: { name, email }, id } = paylaod;
    const currentDate = new Date();
    const query = `
        UPDATE users
        SET name = $1, email = $2, updated_dt = $3
        WHERE id = $4;
    `;
    const queryParams = [name, email, currentDate, id];
    const { rows } = await processDBRequest({ query, queryParams });
    return rows;
}

const deleteStudent = async (id) => {
    // Delete user_profiles first (foreign key constraint)
    const deleteProfileQuery = `DELETE FROM user_profiles WHERE user_id = $1`;
    await processDBRequest({ query: deleteProfileQuery, queryParams: [id] });
    
    // Delete user
    const deleteUserQuery = `DELETE FROM users WHERE id = $1 AND role_id = 3`;
    const { rowCount } = await processDBRequest({ query: deleteUserQuery, queryParams: [id] });
    return rowCount;
}

module.exports = {
    getRoleId,
    findAllStudents,
    addOrUpdateStudent,
    findStudentDetail,
    findStudentToSetStatus,
    findStudentToUpdate,
    deleteStudent
};
