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
    "add-review": {
        body: {
            rating: {
                trim: true,
                isInt: {
                    errorMessage: "Enter Number in rating and less tha 6 !"
                },
                notEmpty: true,
                errorMesssage: "Enter rating !"
            }
        }
    },
    "place-order": {
        body: {
            billingId: {
                notEmpty: true,
                custom: {
                    options: function (id) {
                        if (commonFn.isValidObjectId(id)) {
                            return true;
                        }
                        return false;
                    },
                    errorMessage: "Enter valid billingId"
                },
                errorMessage: "Enter billingId !"
            },
            deliveryId: {
                notEmpty: true,
                optional: { options: { nullable: true } },
                custom: {
                    options: function (id) {
                        if (commonFn.isValidObjectId(id)) {
                            return true;
                        }
                        return false;
                    },
                    errorMessage: "Enter valid deliveryId"
                },
                errorMessage: "Enter deliveryId !"
            },
        }
    }


}