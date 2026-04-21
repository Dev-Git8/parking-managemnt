const prisma = require('../../config/prisma');

const createBusiness = async (ownerId, name, address, totalSlots, price, imageUrl = null) => {
    return await prisma.business.create({
        data: {
            ownerId: parseInt(ownerId),
            name,
            address,
            totalSlots: parseInt(totalSlots),
            pricePerHour: parseFloat(price),
            status: 'pending',
            imageUrl,
        },
    });
};

const getBusinessesByOwner = async (ownerId) => {
    return await prisma.business.findMany({
        where: { ownerId: parseInt(ownerId) },
        orderBy: { createdAt: 'desc' },
    });
};

const getAllApprovedBusinesses = async (limit = 10, offset = 0, searchTerm = '') => {
    return await prisma.business.findMany({
        where: {
            status: 'approved',
            OR: searchTerm ? [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { address: { contains: searchTerm, mode: 'insensitive' } },
            ] : undefined,
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
    });
};

const getBusinessById = async (id) => {
    return await prisma.business.findUnique({
        where: { id: parseInt(id) },
    });
};

const updateBusinessStatus = async (id, status) => {
    return await prisma.business.update({
        where: { id: parseInt(id) },
        data: { status },
    });
};

const updateBusinessDetails = async (id, { name, address, totalSlots, price, imageUrl }) => {
    return await prisma.business.update({
        where: { id: parseInt(id) },
        data: {
            name: name || undefined,
            address: address || undefined,
            totalSlots: totalSlots ? parseInt(totalSlots) : undefined,
            pricePerHour: price ? parseFloat(price) : undefined,
            imageUrl: imageUrl || undefined,
        },
    });
};

module.exports = {
    createBusiness,
    getBusinessesByOwner,
    getAllApprovedBusinesses,
    getBusinessById,
    updateBusinessStatus,
    updateBusinessDetails
};
