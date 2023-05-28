import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";

const CropImageModal = ({ isOpen, onClose, onSave, selectedAvatarFile }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [scale, setScale] = useState(1);
  const avatarEditorRef = useRef();

  useEffect(() => {
    if (!selectedAvatarFile) {
      return;
    }

    const file = selectedAvatarFile;
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
  }, [selectedAvatarFile]);

  const handleSaveClick = () => {
    if (avatarEditorRef.current) {
      const canvas = avatarEditorRef.current.getImage();

      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], selectedAvatarFile.name, {
          type: selectedAvatarFile.type,
        });
        onSave(croppedFile); // Pass the cropped File object to the onSave callback
      });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Recortar imagen</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {imageSrc && (
            <VStack mb={4}>
              <Center width={"full"} border={1} borderColor={"gray.100"} rounded="sm">
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={imageSrc}
                  width={250}
                  height={250}
                  border={50}
                  borderRadius={125}
                  color={[255, 255, 255, 0.6]}
                  scale={scale}
                />
              </Center>
              <Slider
                width={"full"}
                value={scale}
                min={1}
                max={3}
                step={0.01}
                onChange={(value) => setScale(value)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb/>
              </Slider>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" ml={3} onClick={handleSaveClick}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CropImageModal;
