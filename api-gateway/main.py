
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import httpx

app = FastAPI(
    title="Student Management API Gateway",
    description="Single entry point for Student Management microservices",
    version="1.0.0",
)

# Allow the React development server to call the gateway.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICE_URLS = {
    "auth": "http://127.0.0.1:8001",
    "students": "http://127.0.0.1:8002",
    "courses": "http://127.0.0.1:8003",
    "enrollments": "http://127.0.0.1:8003",
}


@app.get("/")
def health_check():
    return {
        "service": "Student Management API Gateway",
        "status": "running",
        "services": SERVICE_URLS,
    }


async def forward_request(request: Request, service_name: str):
    """Forward an incoming request to its target microservice."""

    target_url = SERVICE_URLS[service_name] + request.url.path

    if request.url.query:
        target_url += "?" + request.url.query

    # Forward relevant headers, including the JWT Bearer token.
    headers = {}
    for header_name in ("authorization", "content-type", "accept"):
        value = request.headers.get(header_name)
        if value:
            headers[header_name] = value

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            upstream_response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=await request.body(),
            )

        # Return the upstream status and response body to the client.
        response_headers = {}
        content_type = upstream_response.headers.get("content-type")
        if content_type:
            response_headers["content-type"] = content_type

        return Response(
            content=upstream_response.content,
            status_code=upstream_response.status_code,
            headers=response_headers,
        )

    except httpx.RequestError:
        return Response(
            content=(
                '{"detail":"The requested microservice is unavailable"}'
            ),
            status_code=503,
            media_type="application/json",
        )


@app.api_route(
    "/auth/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def auth_gateway(request: Request, path: str):
    return await forward_request(request, "auth")


@app.api_route(
    "/students",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
@app.api_route(
    "/students/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def students_gateway(request: Request, path: str = ""):
    return await forward_request(request, "students")


@app.api_route(
    "/courses",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
@app.api_route(
    "/courses/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def courses_gateway(request: Request, path: str = ""):
    return await forward_request(request, "courses")


@app.api_route(
    "/enrollments",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
@app.api_route(
    "/enrollments/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def enrollments_gateway(request: Request, path: str = ""):
    return await forward_request(request, "enrollments")
