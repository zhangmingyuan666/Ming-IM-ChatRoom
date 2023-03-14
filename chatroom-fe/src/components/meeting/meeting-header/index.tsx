import {useSelector} from 'react-redux'
import styled from 'styled-components'

const MeetingHeader: React.FC = () => {
    const {userInfo, currentSelectUser} = useSelector((state: any) => state.user)
    return (
        <Container>
            <div>
                {currentSelectUser.username}
            </div>
        </Container>
    )
}

export default MeetingHeader

const Container = styled.div`
   height: 30px; 
   border-bottom: 1px solid #ccc;
   display: flex;
   align-items: center;
   justify-content: center;
`