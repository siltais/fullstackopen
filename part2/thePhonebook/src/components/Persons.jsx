const Persons = ({person, removePerson}) => {
    return(       
        <div>
            {person.name} {person.number} <button onClick={removePerson}>delete</button>
        </div>
    )
}
export default Persons