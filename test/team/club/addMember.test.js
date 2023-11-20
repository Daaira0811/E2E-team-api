import { expect } from "@jest/globals";
import request from "../../request";
import login from "../../login";

const clubMembersEndpoint = "/clubs/655bbb4f09116b47ad85510c/members";
const falseClubMembersEndpoint = "/clubs/5f8d04b16879d72f9ca11666/members";
const endpointwithoutAdmin="/clubs/655bbb2c09116b47ad855100/members";

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
                lastName: "lastName",
                email: "email@email.com",
            })
            .expect(400);
        expect(response.body.error.name).toEqual("member_validation_error");
        expect(response.body.error.message).toEqual("name is required");
    })

    it("[ERROR] return an error when the user lastname is not provided", async () => {
        const response = await request()
            .post(clubMembersEndpoint)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "name",
                email: "email@email.com",
            })
            .expect(400);
        expect(response.body.error.name).toEqual("member_validation_error");
        expect(response.body.error.message).toEqual("lastName is required");
    })
    
    it("[ERROR] return an error when the club doesn't exist", async () => {
        const response = await request()
            .post(falseClubMembersEndpoint)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "test",
                lastName: "test",
                email: "test@emial.com"
            })
            .expect(404);
        expect(response.body.error.name).toEqual("member_club_not_found_error");
        expect(response.body.error.message).toEqual("the club not found");
    });

    it("[ERROR] return an error when the user is not the admin", async () => {
        const response = await request()
            .post(endpointwithoutAdmin)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "name",
                lastName: "lastName",
                email: "email@ufrontera.cl"
            })
            .expect(403);
        expect(response.body.error.name).toEqual("club_user_is_not_the_admin_error");
        expect(response.body.error.message).toEqual("this users is not the admin of this club");
    });
  

    it("[SUCCESS] create a member successful", async () => {
        const response = await request()
            .post(clubMembersEndpoint)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "name",
                lastName: "lastName",
                email: "email3@email.com",
            })
            .expect(201);
        expect(response.body.member).not.toBeNull();
        expect(response.body.member.name).toEqual("name");
        expect(response.body.member.lastName).toEqual("lastName");
        expect(response.body.member.email).toEqual("email3@email.com");
    })
})