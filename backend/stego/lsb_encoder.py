"""
LSB (Least Significant Bit) Encoder Module
Embeds secret messages into images using LSB steganography
"""
from PIL import Image
import io


class LSBEncoder:
    """Encode messages into images using LSB steganography"""
    
    # Delimiter to mark end of message (16 bits)
    DELIMITER = "1111111111111110"
    
    @staticmethod
    def text_to_binary(text: str) -> str:
        """Convert text to binary string"""
        binary = ''.join(format(ord(char), '08b') for char in text)
        return binary
    
    @staticmethod
    def encode(image_path: str, message: str) -> bytes:
        """
        Encode message into image using LSB
        
        Args:
            image_path: Path to source image
            message: Message to hide
            
        Returns:
            Bytes of the stego image
        """
        try:
            # Load image
            img = Image.open(image_path)
            
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Get image dimensions
            width, height = img.size
            
            # Convert message to binary
            binary_message = LSBEncoder.text_to_binary(message)
            binary_message += LSBEncoder.DELIMITER
            
            # Check if message fits
            max_bits = width * height * 3
            if len(binary_message) > max_bits:
                raise ValueError(
                    f"Message too large. Max capacity: {max_bits // 8} bytes, "
                    f"Message size: {len(binary_message) // 8} bytes"
                )
            
            # Load pixel data
            pixels = list(img.getdata())
            new_pixels = []
            
            binary_index = 0
            message_length = len(binary_message)
            
            for pixel in pixels:
                r, g, b = pixel
                
                # Encode in red channel
                if binary_index < message_length:
                    r = (r & 0xFE) | int(binary_message[binary_index])
                    binary_index += 1
                
                # Encode in green channel
                if binary_index < message_length:
                    g = (g & 0xFE) | int(binary_message[binary_index])
                    binary_index += 1
                
                # Encode in blue channel
                if binary_index < message_length:
                    b = (b & 0xFE) | int(binary_message[binary_index])
                    binary_index += 1
                
                new_pixels.append((r, g, b))
                
                # Break if message fully encoded
                if binary_index >= message_length:
                    # Add remaining pixels unchanged
                    new_pixels.extend(pixels[len(new_pixels):])
                    break
            
            # Create new image with modified pixels
            stego_img = Image.new('RGB', (width, height))
            stego_img.putdata(new_pixels)
            
            # Save to bytes
            img_byte_arr = io.BytesIO()
            stego_img.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            
            return img_byte_arr.getvalue()
            
        except Exception as e:
            raise ValueError(f"Encoding failed: {str(e)}")
