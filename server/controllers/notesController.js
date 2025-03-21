//Get All Notes
const getAllNotes = async (req, res) => {
  res.status(200).send("Fetch Successfully");
};
//Create Note
const createNote = async (req, res) => {
  res.status(200).send("Created Successfully");
};
//Update Note
const updateNote = async (req, res) => {
  res.status(200).send("Updated Successfully");
};
//Delete Note
const deleteNote = async (req, res) => {
  res.status(200).send("Deleted Successfully");
};

export default { getAllNotes, createNote, updateNote, deleteNote };
