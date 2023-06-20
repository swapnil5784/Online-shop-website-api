module.exports = {

    "remove-address": {
        params: {
            addressId: {
                trim: true,
                notEmpty: true,
                errorMessage: "Please Provide addressId",
                custom: {
                    options: function (Id) {
                        if (commonFn.isValidObjectId(Id)) {
                            return true;
                        }
                        return false;
                    },
                    errorMessage: 'addressId is invalid'
                }
            }
        }
    },
    "update-address": {
        params: {
            addressId: {
                trim: true,
                notEmpty: true,
                errorMessage: "Please Provide addressId",
                custom: {
                    options: function (Id) {
                        if (commonFn.isValidObjectId(Id)) {
                            return true;
                        }
                        return false;
                    },
                    errorMessage: 'addressId is invalid'
                }
            }
        }
    },
    "place-order": {
        body: {
            billingId: {
                trim: true,
                notEmpty: true,
                errorMessage: "Please Provide billingId",
                custom: {
                    options: function (Id) {
                        if (commonFn.isValidObjectId(Id)) {
                            return true;
                        }
                        return false;
                    },
                    errorMessage: 'billingId is invalid'
                }
            },
        }
    }


}