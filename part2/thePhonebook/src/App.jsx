import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [displayMessage, setDisplayMessage] = useState(null)
  const [messageClass, setMessageClass] = useState('success')

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if(existsInArray()){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){

        const person = persons.find(p => p.name === newName)
        const changedNumber = { ...person, number: newNumber }     
        
        personService
          .update(person.id, changedNumber)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
            setNewName('')
            setNewNumber('')
            setMessageClass('success')
            setDisplayMessage(
              `Number for ${updatedPerson.name} successfully changed`
            )
            setTimeout(() => {
              setDisplayMessage(null)
            }, 5000)
          })
          .catch(
            error => {
            setMessageClass('error')
            if(error.response.data.error){
              setDisplayMessage(error.response.data.error)
            }else{
              setDisplayMessage(`Information of ${person.name} has already been removed from server`)
              setTimeout(() => {
                setDisplayMessage(null)
              }, 5000)
              setPersons(persons.filter(p => p.id !== person.id))
            }
          })

      }
      return
    }
    const nameObject = {
      name: newName,
      number: newNumber
    } 

    personService
      .create(nameObject)
      .then(addedPerson => {
        setPersons(persons.concat(addedPerson))
        setNewName('')
        setNewNumber('')
        setMessageClass('success')
        setDisplayMessage(
          `Added ${addedPerson.name}`
        )
        setTimeout(() => {
          setDisplayMessage(null)
        }, 5000)
    }).catch(error => {
      setMessageClass('error')
      setDisplayMessage(error.response.data.error)
    })
  }

  const removePerson = (id) => {
    const person = persons.find(n => n.id === id)
    if(window.confirm(`Delete ${person.name} ?`)){
      personService
      .remove(id)
      .then(removedPerson => {
        setPersons(persons.filter(p => p.id !== removedPerson.id))
        setMessageClass('success')
        setDisplayMessage(
          `${removedPerson.name} removed successfully`
        )
        setTimeout(() => {
          setDisplayMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessageClass('error')
        setDisplayMessage(`Information of ${person.name} has already been removed from server`)
        setTimeout(() => {
          setDisplayMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
    }    
  } 

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterInput = (event) => {
    setNewFilter(event.target.value)
  }

  const existsInArray = () => {
    return persons.find(({name}) => name === newName)
  }

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
        message={displayMessage} 
        className={messageClass} 
      />     
      <Filter onChange = {handleFilterInput}/>
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit = {addPerson} 
        newName = {newName} 
        changeName = {handleNameChange} 
        newNumber = {newNumber} 
        changeNumber = {handleNumberChange}
      />
      <h2>Numbers</h2>
      {namesToShow.map(person =>
      <Persons
        key = {person.id}
        person = {person}
        removePerson = {() => removePerson(person.id)}
      />
      )}
    </div>
  )
}

export default App
