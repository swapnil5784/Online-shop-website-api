
// const advertisementLog = commonFn.Logger('advertisements')
// To send the vendor list of advertisement
const vendorList = async function (req, res, next) {
    try {
        // query to get all vendors as list
        let vendors = await db.models.vendors.find({});
        // if no vendors in db
        if (!vendors.length) {
            // advertisementLog.error('No vendors found !');
            return res.json({
                type: "error",
                status: 404,
                message: `No vendors found`,
                data: vendors,
            });
        }
        return res.json({
            type: "success",
            status: 200,
            message: `All vendors from /vendors`,
            data: vendors,
        });
    } catch (error) {
        // if error in sending vendor list
        // advertisementLog.error("error at /products/vendors --> index.js route", error);
        console.log("error at /products/vendors --> index.js route", error);
        return res.json({
            type: "error",
            status: 500,
            message: `Server error at /vendors API `,
        });
    }
};

// To send the carousel data list of advertisement
const carouselsList = async function (req, res, next) {
    try {
        // query to get all carousels for advertisement as list
        let advertisements = await db.models.advertisements.find({});
        // query to get offer list from db as list
        let offers = await db.models.offers.find({});
        if (!offers.length && !advertisements.length) {
            // advertisementLog.error(`No advertisements or offer found !`);
            return res.json({
                type: "error",
                status: 404,
                message: `No advertisements or offer found !`,
                data: {
                    carousels: advertisements,
                    offers: offers,
                },
            });
        }
        return res.json({
            type: "success",
            status: 200,
            message: `For /advertisements route`,
            data: {
                carousels: advertisements,
                offers: offers,
            },
        });
    } catch (error) {
        // if error in sending advertisement details
        // advertisementLog.error("error at /banner route", error);
        console.log("error at /banner route", error);
        return res.json({
            type: "error",
            status: 500,
            message: `Server error at /banner API `,
        });
    }
};

// export functions
module.exports = {
    carouselsList,
    vendorList,
};
