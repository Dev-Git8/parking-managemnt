const prisma = require('../../config/prisma');

const getAllBusinesses = async () => {
    return await prisma.business.findMany({
        include: {
            owner: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const updateBusinessStatus = async (id, status) => {
    return await prisma.business.update({
        where: { id: parseInt(id) },
        data: { status },
    });
};

module.exports = {
    getAllBusinesses,
    getAllUsers,
    updateBusinessStatus
};
