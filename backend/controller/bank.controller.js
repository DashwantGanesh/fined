import { Bank } from "../models/bank.model.js";

// ✅ Register bank — accepts all fields including logo file upload
export const registerBank = async (req, res) => {
    try {
        const { bankName, description, website, location } = req.body;

        if (!bankName) {
            return res.status(400).json({
                message: "Bank Name is required",
                success: false
            });
        }

        const existing = await Bank.findOne({ name: bankName });
        if (existing) {
            return res.status(400).json({
                message: "Bank already exists",
                success: false
            });
        }

        // ✅ Handle logo file upload
        let logo = "";
        if (req.file) {
            const base64 = req.file.buffer.toString("base64");
            const mimeType = req.file.mimetype;
            logo = `data:${mimeType};base64,${base64}`;
        }

        const bank = await Bank.create({
            name: bankName,
            description: description || "",
            website: website ? [website] : [],
            location: location || "",
            logo,
            userId: req.id
        });

        return res.status(201).json({
            message: "Bank registered successfully",
            bank,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Registration failed", success: false });
    }
}

// ✅ Fixed: req.id and Bank.find({ userId })
export const getBanks = async (req, res) => {
    try {
        const userId = req.id;
        const banks = await Bank.find({ userId }).sort({ createdAt: -1 });

        if (!banks || banks.length === 0) {
            return res.status(404).json({
                message: "No banks found",
                success: false
            });
        }

        return res.status(200).json({
            banks,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch banks", success: false });
    }
}

// Get bank by ID
export const getBankById = async (req, res) => {
    try {
        const bankId = req.params.id;
        const bank = await Bank.findById(bankId);

        if (!bank) {
            return res.status(404).json({
                message: "Bank not found",
                success: false
            });
        }

        return res.status(200).json({
            bank,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch bank", success: false });
    }
}

// ✅ Update bank — logo via multer buffer, no Cloudinary needed
export const updateBank = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = [website];
        if (location) updateData.location = location;

        if (req.file) {
            const base64 = req.file.buffer.toString("base64");
            const mimeType = req.file.mimetype;
            updateData.logo = `data:${mimeType};base64,${base64}`;
        }

        const bank = await Bank.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!bank) {
            return res.status(404).json({
                message: "Bank not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Bank updated successfully",
            bank,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update bank", success: false });
    }
}