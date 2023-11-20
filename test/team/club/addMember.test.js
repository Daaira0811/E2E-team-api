import { expect } from "@jest/globals";
import request from "../../request";
import login from "../../login";

const clubMembersEndpoint = "/clubs/1/members";

describe("POST member/", () => {
    let token;
    beforeAll(async () => {
        token = await login();
    });
  
    it("[ERROR] return an error when the authorization token is not provided", async () => {
        const response = await request().post(clubMembersEndpoint).expect(401);
        expect(response.body.error.name).toEqual("auhtorization_token_is_required");
        expect(response.body.error.message).toEqual(
            "the authorization header is needed and the token"
        );
    });


    it("[ERROR] return an error when the user name is not provided", async () => {
        const response = await request()
            .post(clubMembersEndpoint)
            .set("Authorization", `Bearer ${token}`)
            .send({
                userId: "123",
            })
            .expect(400);
        expect(response.body.error.name).toEqual("member_validation_error");
        expect(response.body.error.message).toEqual("name is required");
    })
    
    it("[ERROR] return an error when the club doesn't exist", async () => { 

        
    });
});