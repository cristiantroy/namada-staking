import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectTmClient, selectRPCAddress } from '@/store/connectSlice'
import {
  Box,
  Heading,
  Text,
  HStack,
  Icon,
  IconButton,
  Input,
  Skeleton,
  useColorMode,
  Button,
  useColorModeValue,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
import { FiRadio, FiSearch } from 'react-icons/fi'
import { selectNewBlock } from '@/store/streamSlice'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { StatusResponse } from '@cosmjs/tendermint-rpc'

const heightRegex = /^\d+$/
const txhashRegex = /^[a-fA-F0-9]{64}$/
// const addrRegex = /^(tpknam|tnam)[a-zA-Z0-9]+$/

export default function Navbar() {
  const router = useRouter()
  const tmClient = useSelector(selectTmClient)
  const address = useSelector(selectRPCAddress)
  const newBlock = useSelector(selectNewBlock)
  const toast = useToast()
  const [status, setStatus] = useState<StatusResponse | null>()

  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [inputSearch, setInputSearch] = useState('')
  const [isLoadedSkeleton, setIsLoadedSkeleton] = useState(false)

  useEffect(() => {
    if (tmClient) {
      tmClient.status().then((response) => setStatus(response))
    }
  }, [tmClient])

  useEffect(() => {
    if (newBlock || status) {
      setIsLoadedSkeleton(true)
    }
  }, [tmClient, newBlock, status])

  const handleInputSearch = (event: any) => {
    setInputSearch(event.target.value as string)
  }

  const handleSearch = () => {
    if (!inputSearch) {
      toast({
        title: 'Please enter a value!',
        status: 'warning',
        isClosable: true,
      })
      return
    }

    if (heightRegex.test(inputSearch)) {
      router.push('/blocks/' + inputSearch)
    } else if (txhashRegex.test(inputSearch)) {
      router.push('/txs/' + inputSearch)
      // } else if (addrRegex.test(inputSearch)) {
      //   router.push('/accounts/' + inputSearch)
    } else {
      toast({
        title: 'Invalid Height, Transaction!',
        status: 'error',
        isClosable: true,
      })
      return
    }
    setTimeout(() => {
      onClose()
    }, 500)
  }

  return (
    <>
      <Box
        bg={useColorModeValue('light-container', 'dark-container')}
        w="100%"
        p={4}
        shadow={'base'}
        borderRadius={4}
        marginBottom={4}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <HStack>
          <IconButton
            variant="ghost"
            aria-label="Search"
            size="md"
            fontSize="20"
            icon={<FiSearch />}
            onClick={onOpen}
          />
          <IconButton
            variant="ghost"
            aria-label="Color mode"
            size="md"
            fontSize="20"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </HStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              width={400}
              type={'text'}
              borderColor={useColorModeValue('light-theme', 'dark-theme')}
              placeholder="Block Height/Transaction Hash"
              onChange={handleInputSearch}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              bg={useColorModeValue('light-theme', 'dark-theme')}
              _hover={{
                opacity: 0.8,
              }}
              color="white"
              w="full"
              textTransform="uppercase"
              onClick={handleSearch}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
