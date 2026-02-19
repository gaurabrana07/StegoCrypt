"""
AES-256 Encryption Module for StegoCrypt
Provides secure encryption/decryption using AES-256-CBC
"""
import base64
import os
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes


class AESCrypto:
    """Handle AES-256 encryption and decryption"""
    
    SALT_SIZE = 32
    IV_SIZE = 16
    KEY_SIZE = 32
    ITERATIONS = 100000
    
    @staticmethod
    def encrypt(message: str, password: str) -> str:
        """
        Encrypt message using AES-256-CBC
        
        Args:
            message: Plain text message
            password: User password
            
        Returns:
            Base64 encoded string: salt + iv + ciphertext
        """
        try:
            # Generate random salt and IV
            salt = get_random_bytes(AESCrypto.SALT_SIZE)
            iv = get_random_bytes(AESCrypto.IV_SIZE)
            
            # Derive key from password using PBKDF2
            key = PBKDF2(
                password, 
                salt, 
                dkLen=AESCrypto.KEY_SIZE,
                count=AESCrypto.ITERATIONS
            )
            
            # Encrypt message
            cipher = AES.new(key, AES.MODE_CBC, iv)
            padded_message = pad(message.encode('utf-8'), AES.block_size)
            ciphertext = cipher.encrypt(padded_message)
            
            # Combine: salt + iv + ciphertext
            encrypted_data = salt + iv + ciphertext
            
            # Return base64 encoded
            return base64.b64encode(encrypted_data).decode('utf-8')
            
        except Exception as e:
            raise ValueError(f"Encryption failed: {str(e)}")
    
    @staticmethod
    def decrypt(encrypted_message: str, password: str) -> str:
        """
        Decrypt AES-256-CBC encrypted message
        
        Args:
            encrypted_message: Base64 encoded encrypted data
            password: User password
            
        Returns:
            Decrypted plain text message
        """
        try:
            # Decode base64
            encrypted_data = base64.b64decode(encrypted_message)
            
            # Extract salt, IV, and ciphertext
            salt = encrypted_data[:AESCrypto.SALT_SIZE]
            iv = encrypted_data[AESCrypto.SALT_SIZE:AESCrypto.SALT_SIZE + AESCrypto.IV_SIZE]
            ciphertext = encrypted_data[AESCrypto.SALT_SIZE + AESCrypto.IV_SIZE:]
            
            # Derive key from password
            key = PBKDF2(
                password,
                salt,
                dkLen=AESCrypto.KEY_SIZE,
                count=AESCrypto.ITERATIONS
            )
            
            # Decrypt
            cipher = AES.new(key, AES.MODE_CBC, iv)
            padded_message = cipher.decrypt(ciphertext)
            message = unpad(padded_message, AES.block_size)
            
            return message.decode('utf-8')
            
        except ValueError as e:
            raise ValueError("Decryption failed: Invalid password or corrupted data")
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")
