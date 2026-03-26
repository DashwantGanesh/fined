import { Loan } from "../models/loan.model.js";

//posting loan by a bank
export const postLoan = async (req, res) => {
    try {
        const { title, description, loanAmount, interestRate, tenure, bankId } = req.body;
        const userId = req.id;

        if (!title || !description || !loanAmount || !interestRate || !tenure) {
            return res.status(400).json({
                message: "Data Incomplete",
                success: false
            });
        }

        const loan = await Loan.create({
            title,
            description,
            loanAmount: Number(loanAmount),
            interestRate: Number(interestRate),
            tenure,
            bank: bankId,
            created_by: userId,
        });

        return res.status(200).json({
            message: "New Loan Created Successfully!!",
            loan,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
}

// ✅ Update loan
export const updateLoan = async (req, res) => {
    try {
        const loanId = req.params.id;
        const adminId = req.id;
        const { title, description, loanAmount, interestRate, tenure } = req.body;

        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found", success: false });
        }

        // Make sure only the creator can update
        if (loan.created_by.toString() !== adminId) {
            return res.status(403).json({ message: "Not authorized", success: false });
        }

        if (title) loan.title = title;
        if (description) loan.description = description;
        if (loanAmount) loan.loanAmount = Number(loanAmount);
        if (interestRate) loan.interestRate = Number(interestRate);
        if (tenure) loan.tenure = Number(tenure);

        await loan.save();

        return res.status(200).json({
            message: "Loan updated successfully",
            loan,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
}

// ✅ Delete loan
export const deleteLoan = async (req, res) => {
    try {
        const loanId = req.params.id;
        const adminId = req.id;

        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: "Loan not found", success: false });
        }

        if (loan.created_by.toString() !== adminId) {
            return res.status(403).json({ message: "Not authorized", success: false });
        }

        await Loan.findByIdAndDelete(loanId);

        return res.status(200).json({
            message: "Loan deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
}

//getting all loans
export const getAllLoans = async (req, res) => {
    try {
        const keyword = req.query.keyword?.trim() || "";
        const minAmount = req.query.minAmount;
        const maxAmount = req.query.maxAmount;
        const minRate = req.query.minRate;
        const maxRate = req.query.maxRate;
        const tenure = req.query.tenure;
        const sort = req.query.sort || "latest";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        let query = {};
        const orConditions = [];

        if (!isNaN(keyword) && keyword !== "") {
            const num = Number(keyword);
            orConditions.push({ tenure: num }, { loanAmount: num }, { interestRate: num });
        }
        if (keyword && isNaN(keyword)) {
            orConditions.push(
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            );
        }
        if (orConditions.length > 0) query.$or = orConditions;
        if (minAmount || maxAmount) {
            query.loanAmount = {};
            if (minAmount) query.loanAmount.$gte = Number(minAmount);
            if (maxAmount) query.loanAmount.$lte = Number(maxAmount);
        }
        if (minRate || maxRate) {
            query.interestRate = {};
            if (minRate) query.interestRate.$gte = Number(minRate);
            if (maxRate) query.interestRate.$lte = Number(maxRate);
        }
        if (tenure) query.tenure = Number(tenure);

        let sortOption = {};
        if (sort === "low") sortOption.loanAmount = 1;
        else if (sort === "high") sortOption.loanAmount = -1;
        else sortOption.createdAt = -1;

        const loans = await Loan.find(query).populate("bank").sort(sortOption).skip(skip).limit(limit);
        const total = await Loan.countDocuments(query);

        if (loans.length === 0) {
            return res.status(404).json({ message: "Loans not found", success: false });
        }

        return res.status(200).json({
            loans, total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getAllSpLoans = async (req, res) => {
    try {
        const keyword = req.query.keyword?.trim() || "";
        let query = {};
        const orConditions = [];

        if (!isNaN(keyword) && keyword !== "") {
            orConditions.push(
                { tenure: parseInt(keyword, 10) },
                { loanAmount: parseInt(keyword, 10) },
                { interestRate: parseFloat(keyword) }
            );
        }
        if (keyword && isNaN(keyword)) {
            orConditions.push(
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            );
        }
        if (orConditions.length > 0) query.$or = orConditions;

        const loans = await Loan.find(query).populate("bank").sort({ createdAt: -1 });

        if (loans.length === 0) {
            return res.status(400).json({ message: "Loans not found", success: false });
        }

        return res.status(200).json({ loans, success: true });
    } catch (error) {
        console.log(error);
    }
}

export const getLoanById = async (req, res) => {
    try {
        const loanId = req.params.id;
        const loan = await Loan.findById(loanId).populate({ path: "applications" });

        if (!loan) {
            return res.status(400).json({ message: "Loan not found", success: false });
        }

        return res.status(200).json({ loan, success: true });
    } catch (error) {
        console.log(error);
    }
}

export const getAdminLoans = async (req, res) => {
    try {
        const adminId = req.id;
        const loans = await Loan.find({ created_by: adminId }).populate("bank").sort({ createdAt: -1 });

        if (!loans) {
            return res.status(400).json({ message: "Loans not found", success: false });
        }

        return res.status(200).json({ loans, success: true });
    } catch (error) {
        console.log(error);
    }
}