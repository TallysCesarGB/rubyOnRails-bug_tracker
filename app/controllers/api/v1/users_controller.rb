# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController

      def index
        users = User.all.order(:name)
        render json: users.map { |u| serialize_user(u) }
      end

      def show
        user = User.find(params[:id])
        render json: serialize_user_detail(user)
      end

      def create
        user = User.new(user_params)
        if user.save
          render json: serialize_user(user), status: :created
        else
          render json: { error: "Erro ao criar usuário", fields: user.errors }, status: :unprocessable_entity
        end
      end

      def update
        user = User.find(params[:id])
        if user.update(user_params)
          render json: serialize_user(user)
        else
          render json: { error: "Erro ao atualizar", fields: user.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        user = User.find(params[:id])
        user.destroy
        head :no_content
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :role)
      end

      def serialize_user(user)
        {
          id:         user.id,
          name:       user.name,
          email:      user.email,
          role:       user.role,
          created_at: user.created_at
        }
      end

      def serialize_user_detail(user)
        serialize_user(user).merge(
          reported_bugs: user.reported_bugs.count,
          assigned_bugs: user.assigned_bugs.where.not(status: "closed").count
        )
      end
    end
  end
end