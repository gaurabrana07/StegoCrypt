"""
Test Script for StegoCrypt Backend
Tests all core steganography and encryption functions
"""
from stego import AESCrypto, LSBEncoder, LSBDecoder, CapacityAnalyzer
from PIL import Image
import io


def create_test_image(width=800, height=600):
    """Create a test image"""
    print("Creating test image...")
    img = Image.new('RGB', (width, height))
    pixels = []
    for y in range(height):
        for x in range(width):
            # Create a gradient pattern
            r = (x * 255) // width
            g = (y * 255) // height
            b = ((x + y) * 255) // (width + height)
            pixels.append((r, g, b))
    img.putdata(pixels)
    img.save('test_image.png')
    print("✓ Test image created: test_image.png")
    return 'test_image.png'


def test_capacity_analyzer():
    """Test capacity calculation"""
    print("\n=== Testing Capacity Analyzer ===")
    image_path = create_test_image()
    
    capacity = CapacityAnalyzer.calculate_capacity(image_path)
    print(f"✓ Image capacity: {capacity['max_kb']} KB")
    print(f"✓ Dimensions: {capacity['width']}x{capacity['height']}")
    print(f"✓ Total pixels: {capacity['total_pixels']:,}")
    print(f"✓ Max bytes: {capacity['max_bytes']:,}")
    
    return image_path


def test_encryption():
    """Test AES encryption/decryption"""
    print("\n=== Testing AES-256 Encryption ===")
    
    message = "This is a secret message for testing encryption! 🔐"
    password = "SuperSecretPassword123"
    
    print(f"Original message: {message}")
    print(f"Password: {password}")
    
    # Encrypt
    encrypted = AESCrypto.encrypt(message, password)
    print(f"✓ Encrypted (Base64): {encrypted[:50]}...")
    
    # Decrypt
    decrypted = AESCrypto.decrypt(encrypted, password)
    print(f"✓ Decrypted: {decrypted}")
    
    # Verify
    assert message == decrypted, "Decryption failed!"
    print("✓ Encryption/Decryption successful!")
    
    # Test wrong password
    try:
        AESCrypto.decrypt(encrypted, "WrongPassword")
        print("✗ Wrong password should fail!")
    except ValueError as e:
        print(f"✓ Wrong password correctly rejected: {str(e)[:50]}...")
    
    return encrypted


def test_steganography(image_path):
    """Test LSB encoding/decoding"""
    print("\n=== Testing LSB Steganography ===")
    
    message = "Hello, this is a hidden message! Testing steganography. 🎭"
    print(f"Message to hide: {message}")
    
    # Encode
    print("Encoding message into image...")
    stego_bytes = LSBEncoder.encode(image_path, message)
    
    # Save stego image
    stego_path = 'test_stego.png'
    with open(stego_path, 'wb') as f:
        f.write(stego_bytes)
    print(f"✓ Stego image saved: {stego_path}")
    
    # Decode
    print("Decoding message from stego image...")
    decoded_message = LSBDecoder.decode(stego_path)
    print(f"✓ Decoded message: {decoded_message}")
    
    # Verify
    assert message == decoded_message, "Decoded message doesn't match!"
    print("✓ Steganography encoding/decoding successful!")
    
    return stego_path


def test_full_pipeline(image_path):
    """Test complete encryption + steganography pipeline"""
    print("\n=== Testing Full Pipeline (Encryption + Steganography) ===")
    
    original_message = "Top secret information! Meet at midnight. 🌙"
    password = "MySecretKey456"
    
    print(f"Original message: {original_message}")
    print(f"Password: {password}")
    
    # Step 1: Encrypt
    encrypted_message = AESCrypto.encrypt(original_message, password)
    print(f"✓ Step 1: Message encrypted")
    
    # Step 2: Encode into image
    stego_bytes = LSBEncoder.encode(image_path, encrypted_message)
    stego_path = 'test_full_pipeline.png'
    with open(stego_path, 'wb') as f:
        f.write(stego_bytes)
    print(f"✓ Step 2: Encrypted message hidden in image: {stego_path}")
    
    # Step 3: Decode from image
    decoded_encrypted = LSBDecoder.decode(stego_path)
    print(f"✓ Step 3: Extracted encrypted data from image")
    
    # Step 4: Decrypt
    final_message = AESCrypto.decrypt(decoded_encrypted, password)
    print(f"✓ Step 4: Decrypted message: {final_message}")
    
    # Verify
    assert original_message == final_message, "Final message doesn't match!"
    print("✓ Full pipeline successful! 🎉")


def test_edge_cases(image_path):
    """Test edge cases"""
    print("\n=== Testing Edge Cases ===")
    
    # Empty message
    try:
        LSBEncoder.encode(image_path, "")
        print("✓ Empty message handled")
    except Exception as e:
        print(f"✓ Empty message rejected: {str(e)[:50]}")
    
    # Very long message
    capacity = CapacityAnalyzer.calculate_capacity(image_path)
    long_message = "A" * (capacity['max_bytes'] + 1000)
    try:
        LSBEncoder.encode(image_path, long_message)
        print("✗ Message too large should fail!")
    except ValueError as e:
        print(f"✓ Oversized message rejected: {str(e)[:50]}...")
    
    # Special characters
    special_msg = "Testing: 你好 мир 🌍 emoji & symbols! @#$%^&*()"
    stego = LSBEncoder.encode(image_path, special_msg)
    with open('test_special.png', 'wb') as f:
        f.write(stego)
    decoded = LSBDecoder.decode('test_special.png')
    assert special_msg == decoded, "Special characters failed!"
    print("✓ Special characters handled correctly")


def main():
    """Run all tests"""
    print("=" * 60)
    print("StegoCrypt Backend Test Suite")
    print("=" * 60)
    
    try:
        # Create test image
        image_path = test_capacity_analyzer()
        
        # Test encryption
        test_encryption()
        
        # Test steganography
        test_steganography(image_path)
        
        # Test full pipeline
        test_full_pipeline(image_path)
        
        # Test edge cases
        test_edge_cases(image_path)
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED! 🎉")
        print("=" * 60)
        print("\nGenerated test files:")
        print("  - test_image.png (test cover image)")
        print("  - test_stego.png (steganography test)")
        print("  - test_full_pipeline.png (full pipeline test)")
        print("  - test_special.png (special characters test)")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
