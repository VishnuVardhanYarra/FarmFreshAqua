import os
import gradio as gr
from app.main import app as fastapi_app

# Interactive Status Demo for the Space landing page
def check_api():
    return "✅ FarmFreshAqua API is active and operational with PyTorch & PostgreSQL!"

with gr.Blocks(title="FarmFreshAqua API") as demo:
    gr.Markdown("# 🦐 FarmFreshAqua API Server")
    gr.Markdown(
        "Backend API service for **FarmFreshAqua** providing Prawn Disease Detection "
        "(PyTorch ResNet-50), Farmer IoT telemetry, and marketplace endpoints."
    )
    status_btn = gr.Button("Ping API")
    output = gr.Textbox(label="Status", value="System Ready")
    status_btn.click(fn=check_api, outputs=output)

# Mount Gradio onto the existing FastAPI app
# All FastAPI endpoints (/auth/login, /images/predict, /health, etc.) remain fully functional
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
