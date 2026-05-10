const { Address } = require('../../models/shop.models');

exports.getAddress = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const addresses = await Address.find({ user_id }).sort({ isDefault: -1 });

    res.status(200).json(addresses);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 ADD / UPDATE ADDRESS
exports.saveAddress = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const {
      name,
      mobile,
      pincode,
      house,
      area,
      locality,
      city,
      state
    } = req.body;

    if (!name || !mobile || !pincode || !house || !area || !locality || !city || !state) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 If first address → make default
    const existing = await Address.find({ user_id });

    const newAddress = new Address({
      user_id,
      name,
      mobile,
      pincode,
      house,
      area,
      locality,
      city,
      state,
      isDefault: existing.length === 0
    });

    await newAddress.save();

    res.status(201).json({
      message: "Address added",
      address: newAddress
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const updated = await Address.findByIdAndUpdate(
      addressId,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 DELETE ADDRESS (optional)
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    await Address.findByIdAndDelete(addressId);

    res.status(200).json({ message: "Address deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { addressId } = req.params;

    // remove old default
    await Address.updateMany(
      { user_id },
      { isDefault: false }
    );

    // set new default
    await Address.findByIdAndUpdate(addressId, {
      isDefault: true
    });

    res.status(200).json({ message: "Default address updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};