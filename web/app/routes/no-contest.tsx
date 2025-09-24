import { useNavigation } from 'react-router'

const NoContest = () => {
  const navigation = useNavigation()
  const loading = !!navigation.location

  if (loading) {
    return (
      <div className="flex w-52 flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    )
  }
  return <div>Choose a contest from the menu.</div>
}

export default NoContest
