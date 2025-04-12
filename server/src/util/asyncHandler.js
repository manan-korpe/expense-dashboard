const asyncHandler = (fs) => {
	return (req,res,next)=>{
		Promise
		.resolve(fs(req,res,next))
		.catch(err=>res.status(500).json({success:false,message:err.message ||" something want wrong"}))
	}
}
export default asyncHandler;