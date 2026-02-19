"""
Capacity Analyzer Module
Calculates maximum message capacity for an image
"""
from PIL import Image


class CapacityAnalyzer:
    """Analyze image capacity for steganography"""
    
    @staticmethod
    def calculate_capacity(image_path: str) -> dict:
        """
        Calculate maximum message capacity
        
        Args:
            image_path: Path to image file
            
        Returns:
            Dictionary with capacity information
        """
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if needed
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                width, height = img.size
                
                # Total pixels
                total_pixels = width * height
                
                # Each pixel has 3 channels (RGB)
                # We can use 1 bit per channel (LSB)
                total_bits = total_pixels * 3
                
                # Account for delimiter (16 bits)
                delimiter_bits = 16
                
                # Available bits for message
                available_bits = total_bits - delimiter_bits
                
                # Convert to bytes
                max_bytes = available_bits // 8
                
                # Convert to KB
                max_kb = max_bytes / 1024
                
                return {
                    "max_bytes": max_bytes,
                    "max_kb": round(max_kb, 2),
                    "total_pixels": total_pixels,
                    "width": width,
                    "height": height,
                    "total_bits": total_bits
                }
                
        except Exception as e:
            raise ValueError(f"Failed to analyze image: {str(e)}")
    
    @staticmethod
    def can_fit_message(image_path: str, message_length: int) -> bool:
        """
        Check if message can fit in image
        
        Args:
            image_path: Path to image
            message_length: Length of message in bytes
            
        Returns:
            True if message fits, False otherwise
        """
        capacity = CapacityAnalyzer.calculate_capacity(image_path)
        return message_length <= capacity["max_bytes"]
