const Data = require('../models/Data');

exports.storeData = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_REQUEST',
        message: 'Invalid request. Both key and value are required.',
      });
    }

    const dataExists = await Data.exists({ key });
    if (dataExists) {
      return res.status(400).json({
        status: 'error',
        code: 'KEY_EXISTS',
        message: 'The provided key already exists in the database. To update an existing key, use the update API.',
      });
    }

    const data = new Data({
      key,
      value,
    });
    await data.save();

    return res.status(201).json({
      status: 'success',
      message: 'Data stored successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred. Please try again later.',
    });
  }
};

exports.retrieveData = async (req, res) => {
  try {
    const { key } = req.params;

    const data = await Data.findOne({ key });
    if (!data) {
      return res.status(404).json({
        status: 'error',
        code: 'KEY_NOT_FOUND',
        message: 'The provided key does not exist in the database.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        key: data.key,
        value: data.value,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred. Please try again later.',
    });
  }
};

exports.updateData = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const data = await Data.findOneAndUpdate({ key }, { value }, { new: true });
    if (!data) {
      return res.status(404).json({
        status: 'error',
        code: 'KEY_NOT_FOUND',
        message: 'The provided key does not exist in the database.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Data updated successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred. Please try again later.',
    });
  }
};

exports.deleteData = async (req, res) => {
    try {
      const { key } = req.params;
  
      const data = await Data.findOneAndDelete({ key });
      if (!data) {
        return res.status(404).json({
          status: 'error',
          code: 'KEY_NOT_FOUND',
          message: 'The provided key does not exist in the database.',
        });
      }
  
      return res.status(200).json({
        status: 'success',
        message: 'Data deleted successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred. Please try again later.',
      });
    }
  };
  