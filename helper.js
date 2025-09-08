const getOtherMember = (members,user)=>{
    return members.find((member)=>(member._id.toString() !== user.toString()))
}

export {getOtherMember}