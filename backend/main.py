"""
FastAPI Main Application for StegoCrypt
Handles API endpoints for encoding, decoding, and capacity analysis
"""
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import os
from stego import AESCrypto, LSBEncoder, LSBDecoder, CapacityAnalyzer

# Initialize FastAPI app
app = FastAPI(
    title="StegoCrypt API",
    description="Image Steganography with AES-256 Encryption",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://stego-crypt-tau.vercel.app",  # Production frontend
        "http://localhost:3000",  # Local development
        "http://localhost:5173"   # Vite default port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Capacity-Used", "X-Encryption-Used", "X-Message-Size"],
)

# Allowed image formats
ALLOWED_FORMATS = {'image/png', 'image/bmp', 'image/jpeg', 'image/jpg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def validate_image(file: UploadFile) -> None:
    """Validate uploaded image file"""
    # Check file type
    if file.content_type not in ALLOWED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file format. Allowed: PNG, BMP, JPEG"
        )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "StegoCrypt API",
        "version": "1.0.0",
        "description": "Image Steganography with AES-256 Encryption",
        "endpoints": {
            "encode": "/encode",
            "decode": "/decode",
            "capacity": "/capacity"
        }
    }


@app.post("/encode")
async def encode_message(
    image: UploadFile = File(...),
    message: str = Form(...),
    password: str = Form(None)
):
    """
    Encode a message into an image
    
    - **image**: Image file (PNG, BMP, JPEG)
    - **message**: Secret message to hide
    - **password**: Optional password for AES-256 encryption
    """
    try:
        # Validate image
        validate_image(image)
        
        # Read image
        image_bytes = await image.read()
        
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {MAX_FILE_SIZE // (1024*1024)} MB"
            )
        
        # Save temp file
        temp_input_path = f"temp_input_{os.urandom(8).hex()}.png"
        with open(temp_input_path, "wb") as f:
            f.write(image_bytes)
        
        try:
            # Check capacity
            capacity_info = CapacityAnalyzer.calculate_capacity(temp_input_path)
            
            # Encrypt message if password provided
            final_message = message
            encryption_used = False
            
            if password and password.strip():
                try:
                    final_message = AESCrypto.encrypt(message, password)
                    encryption_used = True
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Encryption error: {str(e)}")
            
            # Check if message fits
            message_size = len(final_message.encode('utf-8'))
            if message_size > capacity_info["max_bytes"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Message too large. Max capacity: {capacity_info['max_kb']} KB, "
                           f"Message size: {round(message_size/1024, 2)} KB"
                )
            
            # Encode message
            stego_image_bytes = LSBEncoder.encode(temp_input_path, final_message)
            
            # Calculate capacity used
            capacity_used_percent = round((message_size / capacity_info["max_bytes"]) * 100, 2)
            
            # Return stego image
            return StreamingResponse(
                io.BytesIO(stego_image_bytes),
                media_type="image/png",
                headers={
                    "Content-Disposition": "attachment; filename=stego_image.png",
                    "X-Capacity-Used": str(capacity_used_percent),
                    "X-Encryption-Used": str(encryption_used),
                    "X-Message-Size": str(message_size)
                }
            )
            
        finally:
            # Cleanup temp file
            if os.path.exists(temp_input_path):
                os.remove(temp_input_path)
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/decode")
async def decode_message(
    image: UploadFile = File(...),
    password: str = Form(None)
):
    """
    Decode a hidden message from an image
    
    - **image**: Stego image file
    - **password**: Password if message was encrypted
    """
    try:
        # Validate image
        validate_image(image)
        
        # Read image
        image_bytes = await image.read()
        
        # Save temp file
        temp_path = f"temp_decode_{os.urandom(8).hex()}.png"
        with open(temp_path, "wb") as f:
            f.write(image_bytes)
        
        try:
            # Decode message
            hidden_message = LSBDecoder.decode(temp_path)
            
            # Decrypt if password provided
            decryption_used = False
            final_message = hidden_message
            
            if password and password.strip():
                try:
                    final_message = AESCrypto.decrypt(hidden_message, password)
                    decryption_used = True
                except ValueError as e:
                    raise HTTPException(
                        status_code=401,
                        detail="Wrong password or message was not encrypted with a password"
                    )
                except Exception as e:
                    raise HTTPException(
                        status_code=401,
                        detail=f"Decryption failed: {str(e)}"
                    )
            
            return {
                "success": True,
                "message": final_message,
                "decryption_used": decryption_used,
                "message_length": len(final_message)
            }
            
        finally:
            # Cleanup temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/capacity")
async def check_capacity(image: UploadFile = File(...)):
    """
    Check maximum message capacity for an image
    
    - **image**: Image file to analyze
    """
    try:
        # Validate image
        validate_image(image)
        
        # Read image
        image_bytes = await image.read()
        
        # Save temp file
        temp_path = f"temp_capacity_{os.urandom(8).hex()}.png"
        with open(temp_path, "wb") as f:
            f.write(image_bytes)
        
        try:
            # Calculate capacity
            capacity_info = CapacityAnalyzer.calculate_capacity(temp_path)
            
            return {
                "success": True,
                "capacity": capacity_info
            }
            
        finally:
            # Cleanup temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "StegoCrypt API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
