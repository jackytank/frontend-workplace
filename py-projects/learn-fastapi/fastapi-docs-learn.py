from datetime import datetime, timedelta, time
from enum import Enum
from http import HTTPStatus
from typing import Optional, Annotated, Any, Union
from fastapi import FastAPI, Query, Path, Body, Cookie, Header, Response, Form
from pydantic import BaseModel, Field, HttpUrl, EmailStr
from starlette import status
from starlette.responses import RedirectResponse, JSONResponse

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/dang-nhap/")
async def dang_nhap(
        username: Annotated[str, Form()],
        password: Annotated[str, Form()],
):
    return {
        "username": username,
        "password": password
    }


class BaseVehicle(BaseModel):
    description: str
    type: str


class CarVehicle(BaseVehicle):
    type: str = "car"


class PlaneVehicle(BaseVehicle):
    type: str = "plane"
    size: int


items = {
    "item1": {"description": "All my friends drive a low rider", "type": "car"},
    "item2": {
        "description": "Music is my aeroplane, it's my aeroplane",
        "type": "plane",
        "size": 5,
    },
}


@app.get("/keyword-weights/",
         response_model=dict[str, float],
         status_code=status.HTTP_200_OK
         )
async def read_keyword_weights():
    return {
        "foo": 2.3,
        "bar": 3.4
    }


@app.get("/vehicles/{vehicle_id}",
         response_model=Union[PlaneVehicle, CarVehicle],
         response_model_exclude_unset=True,
         status_code=HTTPStatus.INTERNAL_SERVER_ERROR
         )
async def read_vehicle(vehicle_id: str):
    return items[vehicle_id]


class NguoiBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None


class NguoiIn(NguoiBase):
    password: str


class NguoiOut(NguoiBase):
    pass


class NguoiInDB(NguoiBase):
    hashed_password: str


def fake_password_hasher(raw_password: str):
    return "supersecret" + raw_password


def fake_save_user(user_in: NguoiIn):
    hashed_password = fake_password_hasher(user_in.password)
    user_in_db = NguoiInDB(**user_in.model_dump(), hashed_password=hashed_password)
    print("User saved! ..not really")
    return user_in_db


@app.post("/tao-nguoi/", response_model=NguoiOut)
async def tao_nguoi(nguoi_in: NguoiIn):
    nguoi_saved = fake_save_user(nguoi_in)
    return nguoi_saved


@app.get("/portal")
async def get_portal(teleport: bool = False) -> Response:
    if teleport:
        return RedirectResponse(url="https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    return JSONResponse(content={"message": "Here's your interdimensional portal."})


class StupidBaseUser(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None


class StupidUserIn(StupidBaseUser):
    password: str


@app.post("/create-user/")
async def create_user(user: StupidUserIn) -> StupidBaseUser:
    return user


class CookieModel(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
    tags: list[str] = []


@app.get("/cookies/", response_model=list[CookieModel])
async def read_cookies(
        ads_id: Annotated[str | None, Cookie()] = None,
        user_agent: Annotated[str | None, Header()] = None,
        x_token: Annotated[list[str] | None, Header()] = None
) -> Any:
    print(ads_id)
    print(user_agent)
    print(x_token)
    return [
        {"name": "peanut butter", "price": 10.5},
        {"name": "chocolate chip", "price": 12.5},
    ]


class Image(BaseModel):
    url: HttpUrl
    name: str


class ShitModel(BaseModel):
    name: str
    description: str | None = Field(
        default=None, title="The Description of the item", max_length=300
    )
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: float | None = None
    skills: list[str] = []
    tags: set[str] = set()
    image: Image | None = None
    images: list[Image] | None = None


@app.put("/times/{time_id}")
async def update_time(
        time_id: int,
        start_datetime: Annotated[datetime | None, Body()] = None,
        end_datetime: Annotated[datetime | None, Body()] = None,
        repeat_at: Annotated[time | None, Body()] = None,
        process_after: Annotated[timedelta | None, Body()] = None,
):
    start_process = start_datetime + process_after
    duration = end_datetime - start_process
    return {
        "time_id": time_id,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime,
        "repeat_at": repeat_at,
        "process_after": process_after,
        "start_process": start_process,
        "duration": duration,
    }


@app.put("/shits/{shit_id}", response_model=ShitModel)
async def update_shit(
        shit_id: int,
        item: Annotated[ShitModel, Body(embed=True)],
):
    return {
        "name": str(shit_id) + item.name
    }


@app.get("/shits/{shit_id}")
async def read_shits(
        shit_id: Annotated[int, Path(
            title="The ID of the shit to get",
            ge=1,
            le=10
        )],
        q: Annotated[
            str | None,
            Query(
                min_length=3,
                max_length=50,
                pattern="^fixedquery$",
                alias="item-query",
                deprecated=True,
            )
        ] = None,
        x: Annotated[
            list[str],
            Query(
                title="Query List String",
                description="Query List String Desc",
                min_length=2,
                max_length=5,
            )
        ] = ['foo', 'bar'],
        hidden_query: Annotated[
            str | None,
            Query(include_in_schema=False)
        ] = None,
        importance: Annotated[int, Body(embed=True)] = 2
):
    results = {"shits": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q or x or shit_id or importance:
        results.update({"q": q, "x": x, "shit_id": shit_id, "importance": importance})
    if hidden_query:
        results.update({"hidden_query": hidden_query})
    else:
        results.update({"hidden_query": "No hidden query"})
    return results


class CreateItem(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: CreateItem, q: str | None = None):
    result = {"item_id": item_id, **item.model_dump()}
    if q:
        result.update({"q": q})
    return result


@app.post("/items/")
async def create_item(item: CreateItem):
    item_dict = item.dict()
    if item.tax:
        price_with_tax = item.price + item.tax
        item_dict.update({"price_with_tax": price_with_tax})
    return item_dict


@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(
        user_id: int,
        item_id: str,
        q: str | None = None,
        short: bool = False
):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update({"description": "This is an amazing item that has a long description"})
    return item


fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/items/")
async def search_items(skip: int = 0, limit: int = 10):
    return fake_items_db[skip: skip + limit]


@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}


class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"


@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}
    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}
    return {"model_name": model_name, "message": "Have some residuals"}


@app.get("/items/default")
async def default_read_item():
    return {"item_id": "Default"}


@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update({"description": "This is an amazing item that has a long description"})
    return item


weird_students = {
    1: {"name": "John", "age": 17, "year": "year 12"},
    2: {"name": "Mary", "age": 16, "year": "year 11"},
    3: {"name": "Bob", "age": 16, "year": "year 11"},
}


class WeirdStudent(BaseModel):
    name: str
    age: int
    year: str


class UpdateWeirdStudent(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    year: Optional[str] = None


@app.get("/get-student/{student_id}")
def get_student(student_id: int):
    return weird_students[student_id]


@app.get("/get-by-name/{student_id}")
def get_student_by_name(*, student_id: int, name: Optional[str] = None, test: int = 0):
    for student_id in weird_students:
        if weird_students[student_id]["name"] == name:
            return weird_students[student_id]
    return {"Data": "Not found"}


@app.post("/create-student/{student_id}")
def create_student(student_id: int, student: WeirdStudent):
    if student_id in weird_students:
        return {"Error": "Student exists"}
    weird_students[student_id] = student
    return weird_students[student_id]


@app.put("/update-student/{student_id}")
def update_student(student_id: int, student: UpdateWeirdStudent):
    if student_id not in weird_students:
        return {"Error": "Student does not exist"}
    if student.name is not None:
        weird_students[student_id].name = student.name
    if student.age is not None:
        weird_students[student_id].age = student.age
    if student.year is not None:
        weird_students[student_id].year = student.year
    weird_students[student_id] = student
    return weird_students[student_id]


@app.delete("/delete-student/{student_id}")
def delete_student(student_id: int):
    if student_id not in weird_students:
        return {"Error": "Student does not exist"}
    del weird_students[student_id]
