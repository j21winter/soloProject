const Item = require('../models/item.model')
const mongoose = require("mongoose")

// Size Guide Data
const gerber = [
    {brand: 'gerber', type: 'clothes', size:'preemie' , minWeight: 0, maxWeight: 5, minHeight: 0, maxHeight: 17},
    {brand: 'gerber', type: 'clothes', size:'newborn' , minWeight: 5, maxWeight: 8, minHeight: 17, maxHeight: 21},
    {brand: 'gerber', type: 'clothes', size:'0-3M' , minWeight: 8, maxWeight: 12, minHeight: 21, maxHeight: 24},
    {brand: 'gerber', type: 'clothes', size:'3-6M' , minWeight: 0, maxWeight: 16, minHeight: 17, maxHeight: 26},
    {brand: 'gerber', type: 'clothes', size:'6-9M' , minWeight: 16, maxWeight: 20, minHeight: 26, maxHeight: 28},
    {brand: 'gerber', type: 'clothes', size:'12M' , minWeight: 20, maxWeight: 24, minHeight: 28, maxHeight: 30},
    {brand: 'gerber', type: 'clothes', size:'18M' , minWeight: 24, maxWeight: 28, minHeight: 30, maxHeight: 32},
    {brand: 'gerber', type: 'clothes', size:'24M' , minWeight: 28, maxWeight: 32, minHeight: 32, maxHeight: 34},
    {brand: 'gerber', type: 'clothes', size:'2T' , minWeight: 28, maxWeight: 32, minHeight: 32, maxHeight: 34},
    {brand: 'gerber', type: 'clothes', size:'3T' , minWeight: 32, maxWeight: 35, minHeight: 34, maxHeight: 38},
    {brand: 'gerber', type: 'clothes', size:'4T' , minWeight: 35, maxWeight: 39, minHeight: 38, maxHeight: 40},
    {brand: 'gerber', type: 'clothes', size:'5T' , minWeight: 39, maxWeight: 43, minHeight: 40, maxHeight: 44},

    {brand: 'gerber', type: 'clothes', size:'6M' , minWeight: 12, maxWeight: 16, minHeight: 24, maxHeight: 27},
    {brand: 'gerber', type: 'clothes', size:'12M' , minWeight: 16, maxWeight: 20, minHeight: 27, maxHeight: 30},
    {brand: 'gerber', type: 'clothes', size:'18M' , minWeight: 20, maxWeight: 24, minHeight: 30, maxHeight: 33},
    {brand: 'gerber', type: 'clothes', size:'24M' , minWeight: 24, maxWeight: 28, minHeight: 33, maxHeight: 35},
    {brand: 'gerber', type: 'clothes', size:'2T' , minWeight: 24, maxWeight: 28, minHeight: 33, maxHeight: 35},
    {brand: 'gerber', type: 'clothes', size:'3T' , minWeight: 28, maxWeight: 32, minHeight: 35, maxHeight: 39},
    {brand: 'gerber', type: 'clothes', size:'4T' , minWeight: 32, maxWeight: 36, minHeight: 39, maxHeight: 42},
    {brand: 'gerber', type: 'clothes', size:'5T' , minWeight: 36, maxWeight: 42, minHeight: 42, maxHeight: 44},
]
    
const carters = [
    {brand: 'carters', type: 'pajamas', size:'pre' , minWeight: 0, maxWeight: 6, minHeight: 0, maxHeight: 18},
    {brand: 'carters', type: 'pajamas', size:'NB' , minWeight: 6, maxWeight: 9, minHeight: 18, maxHeight: 21.5},
    {brand: 'carters', type: 'pajamas', size:'3M' , minWeight: 9, maxWeight: 12.5, minHeight: 21.5, maxHeight: 24},
    {brand: 'carters', type: 'pajamas', size:'6M' , minWeight: 12.5, maxWeight: 17, minHeight: 24, maxHeight: 27},
    {brand: 'carters', type: 'pajamas', size:'9M' , minWeight: 17, maxWeight: 21, minHeight: 27, maxHeight: 28.5},
    {brand: 'carters', type: 'pajamas', size:'12M' , minWeight: 21, maxWeight: 25, minHeight: 28.5, maxHeight: 30},
    {brand: 'carters', type: 'pajamas', size:'18M' , minWeight: 25, maxWeight: 28, minHeight: 30, maxHeight: 32},
    {brand: 'carters', type: 'pajamas', size:'24M' , minWeight: 28, maxWeight: 30, minHeight: 32, maxHeight: 34},
    {brand: 'carters', type: 'pajamas', size:'2T' , minWeight: 29, maxWeight: 31, minHeight: 35, maxHeight: 36.5},
    {brand: 'carters', type: 'pajamas', size:'3T' , minWeight: 31, maxWeight: 33, minHeight: 36.5, maxHeight: 39},
    {brand: 'carters', type: 'pajamas', size:'4T' , minWeight: 34, maxWeight: 37.5, minHeight: 39, maxHeight: 41.5},
    {brand: 'carters', type: 'pajamas', size:'4' , minWeight: 34, maxWeight: 38.5, minHeight: 40, maxHeight: 42.5},
    {brand: 'carters', type: 'pajamas', size:'5T' , minWeight: 37.5, maxWeight: 42, minHeight: 41.5, maxHeight: 44},

]

async function setUp(sizeGuide){
    try{
        await mongoose.connect("mongodb://localhost:27017/teenyTwine", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const existingData = await Item.find()

        if(existingData.length === 0) {
            await Item.create(sizeGuide)
            console.log("Size Guides Uploaded Successfully")
        } else {
            console.log("SizeGuides already in place")
        }

        await mongoose.connection.close()
    }catch (err){
        console.error("Error during Setup: ", err)
    }
}

setUp(gerber)
setUp(carters)