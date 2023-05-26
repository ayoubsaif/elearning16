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
        const croppedFile = new File([blob], selectedAvatarFile.name, { type: selectedAvatarFile.type });
        onSave(croppedFile); // Pass the cropped File object to the onSave callback
      });
    }
  
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crop Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {imageSrc && (
            <Box textAlign="center">
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
              <Center mt={4}>
                <Slider
                  value={scale}
                  min={1}
                  max={3}
                  step={0.01}
                  onChange={(value) => setScale(value)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Center>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" ml={3} onClick={handleSaveClick}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CropImageModal;
