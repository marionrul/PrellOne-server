const Card = require('../models/card');
const UserController = require('./userController')
const ListController=require('./listController')
const throwError = require('../utils/throwError')

let CardController = () => {}

CardController.getById = async(id) => {
    return await Card.findById(id).populate('members')
                                
}

CardController.getAll = async() => {
    return await Card.find();
}

CardController.update = async(card) => {
    const query = {'_id': card.id}
    const options = {new: true, upsert: true}
    const newCard= await Card.findOneAndUpdate(query, card, options)
    const io=require('../index').io
        io.to(newCard.board).emit("action",{type:"CARD_UPDATED_SUCCESS",
        card:newCard})
    return newCard
}

CardController.create = async(cardData,listId) => {
    try {
        
        const newCard = new Card(cardData)
        newCard.description="Enter your description here"
        await ListController.addCard(listId, newCard.id)
        const card=await newCard.save()
        const io=require('../index').io
        io.to(cardData.board).emit("action",{type:"CARD_ADDED_SUCCESS",
        card:card})
        return card
    }
    catch(error) {
        throwError(500, error)
    }
}

CardController.updateDesc=(desc,cardId)=>{
    const query = {_id: cardId}
    const update = {
        $set: {
            description: desc
        } 
    }
    const options = {new: true, upsert: true}
    return Card.findByIdAndUpdate(query, update, options)
}

CardController.addMember= async (cardId, username) => {
    const query = {_id: cardId}
    const member = await UserController.getByUsername(username)
    if (!member){
        throwError(404, "Member with username not found")
    }
    else {
        const update = {
            $addToSet: {
                members: member._id
            } 
        }
        const options = {new: true, upsert: true}
        const newCard = await Card.findByIdAndUpdate(query, update, options)
        return member
    }
}
module.exports = CardController;