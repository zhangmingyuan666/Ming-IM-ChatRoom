import {wrapper} from '@/wrapper';

export default function Home(props: any) {
  const {vvv} = props

  return (
    <div>
      <div>{vvv}</div>
      <div>haha</div>
      <div>哈哈哈</div>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store: any) => async (ctx: any) => {
  // getServerSideProps 函数本身需要的处理的逻辑代码
  console.log('store', '-------', store);
  console.log(store.getState());

  return {
    props: {

    }
  }
})
