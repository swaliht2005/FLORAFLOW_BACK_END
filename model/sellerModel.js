const mongoose =  require ('mongoos')

const SellerSchema = new mongoose.schema({
     PlantImage:{ type: String,},
     PlantName:{ type:String, require:true},
     PlantingDay:{ type:String, require:true},
     PlantingHeight:{ type:String, require:true},
     PlantAbout:{ type:String, require:true},
})