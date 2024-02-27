import { useState } from 'react'


const Title = ({title}) => (<h1>{title}</h1>)

const Button = ({ handleClick, text }) => (

  <button onClick={handleClick}>
    {text}
  </button>
)

const VotedContent = ({votes, maxVoteIndex, anecdotes}) => {
  if(votes[maxVoteIndex] > 0){
    return (
      <div>
      <div>{anecdotes[maxVoteIndex]}</div>
      <div>has {votes[maxVoteIndex]} votes</div>
      </div>
    )
  }
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const points = [0, 0, 0, 0, 0, 0, 0, 0] 
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(points);
  const [maxVoteIndex, setMaxVoteIndex] = useState(0);

  const Vote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
    getMaxVote(newVotes)
  }

  const getRandomInt = () => {
    const min = 0
    const max = anecdotes.length
    const randomNumber = Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    setSelected(randomNumber)
    getMaxVote(votes)
  }

  const getMaxVote = (votesArray) => {
    const maxIndex = votesArray.indexOf(Math.max(...votesArray))
    setMaxVoteIndex(maxIndex)
  }

  return (
    <div>
      <Title title = 'Anecdote of the day'/>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <Button text = 'vote' handleClick={Vote}/>
      <Button text = 'next anecdote' handleClick={getRandomInt} />
      <Title title = 'Anecdote with most votes'/>
      <VotedContent votes = {votes} maxVoteIndex = {maxVoteIndex} anecdotes = {anecdotes} />
    </div>
  )
}

export default App
