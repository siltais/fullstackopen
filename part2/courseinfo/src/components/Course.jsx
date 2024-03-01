const Header = ({ course }) => <h2>{course}</h2>
const Total = ({ sum }) => <b>total of {sum} exercises </b>
const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )} 
  </>

  const Course = ({courses}) =>
  <>
    {courses.map(course => 
      <div key = {course.id}>
      <Header course={course.name} />
      <Content parts = {course.parts}/>
      <Total sum={getArraySum(course.parts)} />
      </div>
    )} 
  </>

  const getArraySum = (array) => {
    const theSum = array.reduce(
      (a, b) => a + b.exercises, 0)
    return theSum
  }

  export default Course