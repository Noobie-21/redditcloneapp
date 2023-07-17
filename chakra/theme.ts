import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/700.css'
import { extendTheme } from "@chakra-ui/react";
import { Button } from './button';
export const theme = extendTheme({
    colors : {
        brands : {
            100 : '#FF3c80'
        }
    },
    fonts:{
        body : 'Open Sans , san-serif'
    },
    styles:{
        global : () => ({
            body :{
                bg:"gray.200"
            }
        })
    },
    components : {
        Button
    }
})



