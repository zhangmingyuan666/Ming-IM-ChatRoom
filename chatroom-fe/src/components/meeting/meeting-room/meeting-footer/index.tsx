import {addListener, IEventName, offListener} from '@/event'
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react'
import styled from 'styled-components'

const MeetingFooter = (props: any, ref: any) => {
    const shadowDOMRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = (behavior?: 'smooth' | 'auto') => {
        behavior = behavior || 'auto'

        if(shadowDOMRef.current){
            shadowDOMRef.current.scrollIntoView({
                behavior: 'auto',
                block: 'end'
            })
        }
    }

    useImperativeHandle(ref, () => {
        return {
            scrollToBottom: (behavior?: 'smooth' | 'auto') => {
                scrollToBottom(behavior)
            }
        }
    })

    useEffect(() => {
        addListener(IEventName.scrollToBottom, scrollToBottom)

        return () => {
            offListener(IEventName.scrollToBottom, scrollToBottom)
        }
    }, [])

    return <Shadow ref={shadowDOMRef} />
}

export default forwardRef(MeetingFooter)

const Shadow = styled.div`
    height: 10px;
    width: 100%;
    opacity: 0;
`