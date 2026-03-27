module Api
  module V1
    class BugsController < ApplicationController
      before_action :set_bug, only: [:show, :update, :destroy]

      def index
        bugs = Bug.includes(:reporter, :assignee, :project)
        bugs = bugs.by_project(params[:project_id]) if params[:project_id]
        bugs = bugs.where(status: params[:status])   if params[:status]
        render json: bugs
      end

      def show
        render json: @bug, include: [:comments, :reporter, :assignee]
      end

      def create
        bug = Bug.new(bug_params)
        if bug.save
          render json: bug, status: :created
        else
          render json: bug.errors, status: :unprocessable_entity
        end
      end

      def update
        if @bug.update(bug_params)
          render json: @bug
        else
          render json: @bug.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @bug.destroy
        head :no_content
      end

      private

      def set_bug
        @bug = Bug.find(params[:id])
      end

      def bug_params
        params.require(:bug).permit(
          :title, :description, :severity,
          :status, :project_id, :reporter_id, :assignee_id
        )
      end
    end
  end
end