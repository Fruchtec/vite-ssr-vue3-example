import { useContext } from 'vite-ssr/vue'
import {
  onMounted, onUnmounted, Ref, ref, onDeactivated
} from 'vue'
import axios, { AxiosRequestConfig } from 'axios'

interface Config {
   axiosConfig: AxiosRequestConfig;
   /**
    * For Client, if {true} asyncData will try to block component's initialization
    * if {false} it will fetch the data onMounted hook.
    */
   awaitSetup: boolean;
}
/* eslint-disable import/prefer-default-export */
export async function useAsyncData<T>(key: string, location: string, config?: Partial<Config>) {
  const { isClient, initialState } = useContext()
  // - craete a ref via initialState[key] value
  const responseValue = ref(initialState[key] || null) as Ref<T | null>
  // - Axios get request
  const request = () => axios.get<T>(location, config?.axiosConfig)

  // - request handler function, to prevent code duplication I created inline function.
  const handler = async (type: 'server' | 'client') => {
    const { data } = await request()
    responseValue.value = data
    if (type === 'server') {
      initialState[key] = data
    }
  }

  // remove data from initialState when component unmounts or deactivates
  const removeState = () => {
    if (isClient) {
      initialState[key] = null
    }
  }
  onUnmounted(removeState)
  onDeactivated(removeState)

  // - is this function running on server side
  if (!isClient) {
    await handler('server')
  } else {
    // - if this function is running on client side

    // - if initialState[key] already exists mutate responseValue.value
    /* eslint-disable no-lonely-if */
    if (initialState[key]) {
      responseValue.value = initialState[key]
    } else {
      // - if inital state value does not exist fetch the data in onMounted hook or block setup.
      const fn = async () => handler('client')

      if (config?.awaitSetup) {
        await fn()
      } else {
        onMounted(fn)
      }
    }
  }

  return responseValue
}
