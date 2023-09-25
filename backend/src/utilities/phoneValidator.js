exports.checkIfPhoneValid = (phone) => {
  phone = phone.trim();
  return /(0|91)?[6-9][0-9]{9}/.test(phone) && /^\d+$/.test(phone);
};
