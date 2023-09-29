import supertest from "supertest";
import app from "./../src/index";
import fruits from "data/fruits";
import { FruitInput } from "services/fruits-service";

const api = supertest(app)

afterAll(()=>{
    fruits.slice(0)
  })

const missData = {
    name: "Banana",
    price:''
}

describe("API test", () => {

    it("shoud return 404 when trying to get a fruit by an id that doesn't exist",async ()=>{
        const { status } = await api.get("/fruits/5")
        expect(status).toBe(404);
    })

    it("should return 404 when id param is present but not valid",async ()=>{
        const { status } = await api.get("/health/-3")
        expect(status).toBe(404);
    })

    it("should return one fruit when given a valid and existing id",async ()=>{
        const fruta: FruitInput = {name: "morango",price: 15}
        await api.post("/fruits").send(fruta)
        const { status, text } = await api.get("/fruits/1")
        expect(status).toBe(200);
        expect(text).toEqual("{\"name\":\"morango\",\"price\":15,\"id\":1}");
    })    

    it("should return 201 when inserting a fruit", async () => {
        const fruta: FruitInput = {
            name: "Banana",
            price: 20
        }
        const { status } = await api.post("/fruits").send(fruta)
        expect(status).toBe(201);
    })

    it("should return 409 when inserting a fruit that is already registered",async ()=>{
        const fruta = {
            name: "Banana",
            price: 20
        }
        const { status } = await api.post("/fruits").send(fruta)
        expect(status).toBe(409);
    })
    it("should return 422 when inserting a fruit with data missing",async ()=>{
        const { status } = await api.post("/fruits").send(missData)
        expect(status).toBe(422);
    })
    it("should return 200 when get in health",async ()=>{
        const { status } = await api.get("/health")
        expect(status).toBe(200);
    })
    
})