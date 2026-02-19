"""
LSB (Least Significant Bit) Decoder Module
Extracts hidden messages from stego images
"""
from PIL import Image


class LSBDecoder:
    """Decode messages from images using LSB steganography"""
    
    DELIMITER = "1111111111111110"
    
    @staticmethod
    def binary_to_text(binary: str) -> str:
        """Convert binary string to text"""
        text = ''
        # Only process complete bytes
        complete_bytes = (len(binary) // 8) * 8
        for i in range(0, complete_bytes, 8):
            byte = binary[i:i+8]
            try:
                char_code = int(byte, 2)
                # Only include printable characters and common whitespace
                # ASCII printable: 32-126, plus tab(9), newline(10), carriage return(13)
                if (32 <= char_code <= 126) or char_code in (9, 10, 13):
                    text += chr(char_code)
            except (ValueError, OverflowError):
                # Skip invalid bytes
                continue
        return text
    
    @staticmethod
    def decode(image_path: str) -> str:
        """
        Decode hidden message from image
        
        Args:
            image_path: Path to stego image
            
        Returns:
            Extracted hidden message
        """
        try:
            # Load image
            img = Image.open(image_path)
            
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Load pixel data
            pixels = list(img.getdata())
            
            # Extract binary data
            binary_data = ''
            
            for pixel in pixels:
                r, g, b = pixel
                
                # Extract LSB from each channel
                binary_data += str(r & 1)
                binary_data += str(g & 1)
                binary_data += str(b & 1)
                
                # Check for delimiter
                if binary_data.endswith(LSBDecoder.DELIMITER):
                    # Remove delimiter
                    binary_data = binary_data[:-len(LSBDecoder.DELIMITER)]
                    break
            
            # Check if delimiter was found
            if not binary_data or len(binary_data) < 8:
                raise ValueError("No hidden message found in image")
            
            # Convert binary to text
            message = LSBDecoder.binary_to_text(binary_data)
            
            if not message:
                raise ValueError("No hidden message found in image")
            
            # Remove any trailing null bytes or control characters
            message = message.rstrip('\x00\x01\x02\x03\x04\x05\x06\x07\x08\x0b\x0c\x0e\x0f').rstrip()
            
            return message
            
        except Exception as e:
            if "No hidden message" in str(e):
                raise
            raise ValueError(f"Decoding failed: {str(e)}")
