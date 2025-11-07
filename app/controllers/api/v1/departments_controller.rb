module Api
  module V1
    class DepartmentsController < ApplicationController
      before_action :require_admin!, only: [:create, :update, :destroy]
      before_action :set_department, only: [:show, :update, :destroy]

      def index
        departments = Department.all.order(:name)
        render json: departments
      end

      def show
        render json: @department, include: :employees
      end

      def create
        department = Department.new(department_params)
        if department.save
          render json: department, status: :created
        else
          render json: { errors: department.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @department.update(department_params)
          render json: @department
        else
          render json: { errors: @department.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @department.destroy
        head :no_content
      end

      private

      def set_department
        @department = Department.find(params[:id])
      end

      def department_params
        params.require(:department).permit(:name)
      end
    end
  end
end
