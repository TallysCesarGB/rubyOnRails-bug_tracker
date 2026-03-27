module Api
  module V1
    class ProjectsController < ApplicationController

      def index
        projects = Project.all.order(:name)
        render json: projects.map { |p| serialize_project(p) }
      end

      def show
        project = Project.find(params[:id])
        render json: serialize_project_detail(project)
      end

      def create
        project = Project.new(project_params)
        if project.save
          render json: serialize_project(project), status: :created
        else
          render json: { error: "Erro ao criar projeto", fields: project.errors }, status: :unprocessable_entity
        end
      end

      def update
        project = Project.find(params[:id])
        if project.update(project_params)
          render json: serialize_project(project)
        else
          render json: { error: "Erro ao atualizar", fields: project.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        project = Project.find(params[:id])
        project.destroy
        head :no_content
      end

      private

      def project_params
        params.require(:project).permit(:name, :description, :status)
      end

      def serialize_project(project)
        {
          id:          project.id,
          name:        project.name,
          description: project.description,
          status:      project.status,
          bugs_count:  project.bugs.count,
          open_bugs:   project.bugs.where(status: "open").count,
          created_at:  project.created_at
        }
      end

      def serialize_project_detail(project)
        serialize_project(project).merge(
          bugs: project.bugs.order(created_at: :desc).map { |b| serialize_bug_summary(b) }
        )
      end

      def serialize_bug_summary(bug)
        {
          id:       bug.id,
          title:    bug.title,
          severity: bug.severity,
          status:   bug.status
        }
      end
    end
  end
end